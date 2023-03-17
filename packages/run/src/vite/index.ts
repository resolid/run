import type { ResolidRunViteOptions } from './types';
import type { Plugin, ResolvedConfig, UserConfig } from 'vite';
import solidVitePlugin from 'vite-plugin-solid';
import { chunkSplitPlugin } from './plugins/split-chunk';
import { findAny } from './utils/file';
import { join } from 'node:path';
import { solidPlugin } from 'esbuild-plugin-solid';
import { dev } from './node/dev';
import { build } from 'vite';

let secondaryBuildStarted = false;

export default function resolidRun(options: ResolidRunViteOptions = {}): Plugin[] {
  const {
    rootEntry: _rootEntry,
    clientEntry: _clientEntry,
    serverEntry: _serverEntry,
    manualChunks,
    ...solidViteOptions
  } = options;

  let root: string, rootEntry: string, clientEntry: string, serverEntry: string;
  let isBuild: boolean;
  let viteConfig: ResolvedConfig;

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
    solidVitePlugin({ ...solidViteOptions, ssr: true }),
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
                ssr: true,
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
                outDir: join(root, 'dist', 'public'),
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
        },
      },
    } as Plugin,
    manualChunks && chunkSplitPlugin({ manualChunks }),
  ].filter(Boolean) as Plugin[];
}
