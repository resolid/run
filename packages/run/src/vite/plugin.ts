import type { ResolidRunViteOptions } from './types';
import type { Plugin, ResolvedConfig, UserConfig } from 'vite';
import { build } from 'vite';
import solidVitePlugin from 'vite-plugin-solid';
import { chunkSplitPlugin } from './plugins/split-chunk';
import { findAny } from './utils/file';
import { join } from 'node:path';
import { readFileSync, writeFileSync } from 'node:fs';
import { solidPlugin } from 'esbuild-plugin-solid';
import viteInspect from 'vite-plugin-inspect';
import { dev } from './serve/dev';
import type * as Babel from '@babel/core';
import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import { babelOptions, isReturnJsx } from './utils/babel';
import { prepareManifest } from './utils/manifest';
import transformServer from './babel/transformServer';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const traverse = _traverse.default;

let secondaryBuildStarted = false;

export const resolidRunVitePlugin = (options: ResolidRunViteOptions): Plugin[] => {
  const {
    adapter,
    rootEntry: _rootEntry,
    clientEntry: _clientEntry,
    serverEntry: _serverEntry,
    inspect = true,
    manualChunks,
    ...solidViteOptions
  } = options;

  let root: string, rootEntry: string, clientEntry: string, serverEntry: string;
  let outPath: string, clientOutPath: string, serverOutPath: string;
  let isBuild: boolean;
  let viteConfig: ResolvedConfig;
  let finalise: () => Promise<void>;

  const routeComponents = new Set<string>();

  const viteSolidPlugin = solidVitePlugin({
    ...solidViteOptions,
    ssr: true,
    babel: babelOptions(
      (source: string, id: string, ssr: boolean) => ({
        plugins: [
          [
            transformServer,
            {
              ssr,
              root: process.cwd(),
              minify: process.env.NODE_ENV === 'production',
            },
          ],
        ],
      }),
      options.babel
    ),
  });

  return [
    {
      name: 'vite-plugin-resolid-run-config',
      enforce: 'pre',
      config(userConfig, { mode, command }) {
        root = userConfig.root || process.cwd();
        isBuild = command == 'build';

        rootEntry = _rootEntry ?? (findAny(join(root, 'src'), 'root') as string);
        clientEntry = _clientEntry ?? (findAny(join(root, 'src'), 'entry-client') as string);
        serverEntry = _serverEntry ?? (findAny(join(root, 'src'), 'entry-server') as string);

        outPath = join(root, userConfig.build?.outDir || 'dist');
        clientOutPath = join(outPath, 'public');
        serverOutPath = join(root, '.resolid', 'server');

        const config: UserConfig = {
          root,
          define: {
            'import.meta.env.ENTRY_CLIENT': JSON.stringify(clientEntry),
            'import.meta.env.ENTRY_SERVER': JSON.stringify(serverEntry),
          },
          optimizeDeps: {
            exclude: ['@resolid/run', '@solidjs/router', '@solidjs/meta'],
            extensions: ['jsx', 'tsx'],
            esbuildOptions: {
              plugins: [
                solidPlugin({
                  solid: { generate: 'dom', hydratable: true },
                }),
              ],
            },
          },
          resolve: {
            conditions: mode === 'test' ? ['browser', 'solid'] : ['solid'],
            alias: {
              '~resolid-run/root': rootEntry,
              '~resolid-run/entry-client': clientEntry,
              '~resolid-run/entry-server': serverEntry,
            },
          },
          ssr: {
            noExternal: ['@resolid/run', '@solidjs/meta', '@solidjs/router'],
          },
        };

        if (isBuild) {
          if (!config.build) {
            config.build = {};
          }

          config.build.ssr = !secondaryBuildStarted;
        }

        return config;
      },
      configResolved(config) {
        viteConfig = config;
      },
    } as Plugin,
    {
      name: 'vite-plugin-resolid-run-route',
      enforce: 'pre',
      //apply: 'build',
      transform(source, id, transformOptions) {
        if (
          transformOptions?.ssr &&
          (id.includes('.tsx') || id.includes('.mdx')) &&
          id != rootEntry &&
          id != serverEntry
        ) {
          const componentId = id.replace(root + '/', '');

          const ast = parse(source, {
            sourceType: 'module',
            attachComment: false,
            plugins: ['typescript', 'jsx'],
          });

          let componentPath:
            | Babel.NodePath<
                Babel.types.ArrowFunctionExpression | Babel.types.FunctionDeclaration | Babel.types.FunctionExpression
              >
            | undefined;
          let hasUseRunContext = false;

          // noinspection JSUnusedGlobalSymbols
          traverse(ast, {
            ImportDeclaration(path: Babel.NodePath<Babel.types.ImportDeclaration>) {
              if (path.node.source.value === '@resolid/run') {
                hasUseRunContext =
                  path.node.specifiers.findIndex((specifier) => {
                    return (
                      specifier.type == 'ImportSpecifier' &&
                      specifier.imported &&
                      specifier.imported.type == 'Identifier' &&
                      specifier.imported.name === 'useRunContext'
                    );
                  }) >= 0;
              }
            },
            ExportDefaultDeclaration(path: Babel.NodePath<Babel.types.ExportDefaultDeclaration>) {
              const declaration = path.get('declaration');

              if (declaration.isFunctionDeclaration() && isReturnJsx(declaration.node.body)) {
                componentPath = declaration;
              }

              if (declaration.isIdentifier()) {
                const binding = path.scope.getBinding(declaration.node.name);

                if (binding) {
                  if (binding.path.isVariableDeclarator()) {
                    const init = binding.path.get('init') as Babel.NodePath<
                      Babel.types.ArrowFunctionExpression | Babel.types.FunctionExpression
                    >;

                    if (
                      init &&
                      (init.isArrowFunctionExpression() || init.isFunctionExpression()) &&
                      isReturnJsx(init.node.body)
                    ) {
                      componentPath = init;
                    }
                  }

                  if (
                    binding.path.isFunctionDeclaration() &&
                    (binding.path.node.id?.name == 'MDXContent' || isReturnJsx(binding.path.node.body))
                  ) {
                    componentPath = binding.path;
                  }
                }
              }
            },
          });

          if (componentPath) {
            routeComponents.add(componentId);

            const importStatement = hasUseRunContext ? '' : 'import { useRunContext } from "@resolid/run";';
            const injectionCode = `useRunContext().components?.add(${JSON.stringify(componentId)});`;

            const injectionPoint = componentPath.node.body.start ?? 0;

            return (
              importStatement + source.slice(0, injectionPoint + 1) + injectionCode + source.slice(injectionPoint + 1)
            );
          }
        }
      },
    } as Plugin,
    inspect && viteInspect({ build: true, outputDir: join('.resolid', 'inspect') }),
    {
      name: 'vite-plugin-resolid-run-data',
      enforce: 'pre',

      transform(source, id, transformOptions) {
        const babelSolidCompiler = (code: string, id: string) => {
          // @ts-expect-error Cannot invoke
          return viteSolidPlugin.transform(code, id, transformOptions);
        };

        if (id.includes('.data.ts')) {
          return babelSolidCompiler(source, id.replace('.data.ts', '.tsx'));
        }
      },
    } as Plugin,
    viteSolidPlugin,
    {
      name: 'vite-plugin-resolid-run-server',
      config() {
        return {
          appType: 'custom',
        };
      },
      configureServer(viteServer) {
        return dev(viteServer);
      },
    } as Plugin,
    {
      name: 'vite-plugin-resolid-run-build',
      config(userConfig) {
        if (isBuild) {
          const ssr = userConfig.build?.ssr;

          if (ssr) {
            return {
              build: {
                outDir: serverOutPath,
                ssr: true,
                minify: false,
                rollupOptions: {
                  input: serverEntry,
                  output: {
                    inlineDynamicImports: true,
                  },
                },
                target: 'node18',
                ssrEmitAssets: true,
              },
              publicDir: false,
            };
          } else {
            return {
              appType: 'custom',
              build: {
                outDir: clientOutPath,
                manifest: true,
                ssrManifest: true,
                rollupOptions: {
                  input: clientEntry,
                  output: {
                    manualChunks: undefined,
                  },
                },
              },
            };
          }
        }
      },
      writeBundle: {
        sequential: true,
        async handler() {
          if (secondaryBuildStarted) {
            return;
          }

          secondaryBuildStarted = true;

          await build({
            configFile: viteConfig.configFile,
            mode: viteConfig.mode,
            optimizeDeps: {
              force: viteConfig.optimizeDeps.force,
            },
          });

          const manifest = JSON.parse(readFileSync(join(clientOutPath, 'manifest.json')).toString());
          const ssrManifest = JSON.parse(readFileSync(join(clientOutPath, 'ssr-manifest.json')).toString());

          writeFileSync(
            join(clientOutPath, 'route-manifest.json'),
            JSON.stringify(prepareManifest(manifest, ssrManifest, routeComponents, viteConfig.base), null, 2)
          );

          writeFileSync(
            join(serverOutPath, 'route-manifest.json'),
            readFileSync(join(clientOutPath, 'route-manifest.json')).toString()
          );

          finalise = async () => {
            await adapter.build(viteConfig.root, outPath, viteConfig.ssr.external, viteConfig.build.commonjsOptions);
          };
        },
      },
      closeBundle: {
        sequential: true,
        async handler() {
          if (!viteConfig.build.ssr) {
            return;
          }

          await finalise?.();
        },
      },
    } as Plugin,
    manualChunks && chunkSplitPlugin({ manualChunks }),
  ].filter(Boolean) as Plugin[];
};
