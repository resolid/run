import type { Plugin } from 'vite';
import type { ResolidRunVitePluginOptions } from '../types';
import { join } from 'node:path';
import { findAny } from '../utils/file';
import { solidPlugin } from 'esbuild-plugin-solid';

export const configPlugin = (userOptions: ResolidRunVitePluginOptions): Plugin => {
  return {
    name: 'vite-plugin-resolid-run-config',
    enforce: 'pre',

    // @ts-expect-error onDispose' is declared here
    config(userConfig, { mode }) {
      const root = userConfig.root || process.cwd();

      const rootEntry = userOptions.rootEntry ?? (findAny(join(root, 'src'), 'root') as string);
      const clientEntry = userOptions.clientEntry ?? (findAny(join(root, 'src'), 'entry-client') as string);
      const serverEntry = userOptions.serverEntry ?? (findAny(join(root, 'src'), 'entry-server') as string);

      return {
        root,

        build: {
          outDir: join(root, 'dist', 'public'),
          target: 'esnext',
          manifest: true,
          ssrManifest: true,
          rollupOptions: {
            input: clientEntry,
            output: {
              manualChunks: undefined,
            },
          },
        },

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
    },
  };
};
