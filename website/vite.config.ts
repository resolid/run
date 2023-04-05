import { fileURLToPath, URL } from 'url';
import { defineConfig, type UserConfig } from 'vite';
import resolid from '@resolid/run/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import resolidRunNode from '@resolid/run-node';
import { mdx } from './scripts/vite-plugin-mdx';

export default defineConfig(async ({ command }) => {
  const isBuild = command == 'build';

  const config: UserConfig = {
    plugins: [
      !isBuild && tsconfigPaths(),
      await mdx({
        rehypePlugins: [],
        remarkPlugins: [],
      }),
      resolid({
        adapter: resolidRunNode(),
        extensions: ['.mdx'],
        manualChunks(id) {
          if (id.includes('/node_modules/solid-js/') || id.includes('/node_modules/@solidjs/')) {
            return 'solid';
          }

          if (id.includes('/node_modules/@resolid/') && !id.includes('/node_modules/@resolid/run/')) {
            return 'resolid';
          }

          if (id.includes('/node_modules/')) {
            return 'vendor';
          }

          if (id.includes('/packages/') && !id.includes('/packages/run/')) {
            return 'resolid';
          }
        },
      }),
    ],
    build: {
      minify: true,
    },
  };

  if (isBuild) {
    config.resolve = {
      alias: [{ find: '~', replacement: fileURLToPath(new URL('./src', import.meta.url)) }],
    };
  }

  return config;
});
