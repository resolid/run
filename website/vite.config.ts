import { fileURLToPath, URL } from 'url';
import { defineConfig, type UserConfig } from 'vite';
import resolid from '@resolid/run/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import resolidRunNode from '@resolid/run-node';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import mdx from '@mdx-js/rollup';
import rehypeHeadings from './scripts/rehype-headings';

export default defineConfig(async ({ command }) => {
  const isBuild = command == 'build';

  const config: UserConfig = {
    plugins: [
      !isBuild && tsconfigPaths(),
      {
        ...mdx({
          jsx: true,
          jsxImportSource: 'solid-js',
          providerImportSource: '@resolid/mdx',
          elementAttributeNameCase: 'html',
          rehypePlugins: [rehypeSlug, rehypeHeadings],
          remarkPlugins: [remarkGfm],
        }),
        enforce: 'pre',
      },
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
