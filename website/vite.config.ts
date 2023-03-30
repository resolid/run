import { fileURLToPath, URL } from 'url';
import { defineConfig, type Plugin, type UserConfig } from 'vite';
import resolid from '@resolid/run/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { slugify } from '@resolid/utils';
import { parse } from 'acorn';

const mdx = async (config: { rehypePlugins: []; remarkPlugins: [] }) => {
  const cache = new Map();
  const headingsCache = new Map();

  const rehypeCollectHeadings = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function (ast: any, vfile: any) {
      const headings: { depth: number; slug: string; text: string }[] = [];

      visit(ast, 'element', (node) => {
        if (node.tagName[0] !== 'h') {
          return;
        }

        const [, level] = node.tagName.match(/h([0-6])/) ?? [];

        if (!level) {
          return;
        }

        const depth = Number.parseInt(level);

        let text = '';

        visit(node, (child, __, parent) => {
          if (child.type === 'element' || parent == null) {
            return;
          }

          if (child.type === 'raw' && child.value.match(/^\n?<.*>\n?$/)) {
            return;
          }

          if (new Set(['text', 'raw', 'mdxTextExpression']).has(child.type)) {
            text += child.value;
          }
        });

        node.properties = node.properties || {};

        if (typeof node.properties.id !== 'string') {
          let slug = slugify(text);

          if (slug.endsWith('-')) {
            slug = slug.slice(0, -1);
          }

          node.properties.id = slug;
        }

        headings.push({ depth, slug: node.properties.id as string, text });
      });

      headingsCache.set(vfile.path, headings);

      ast.children.unshift({
        type: 'mdxjsEsm',
        value: '',
        data: {
          estree: {
            body: [],
            ...parse(`export const getHeadings = () => { return ${JSON.stringify(headings)} }`, {
              sourceType: 'module',
              ecmaVersion: 2020,
            }),
            type: 'Program',
            sourceType: 'module',
          },
        },
      });
    };
  };

  const plugin = {
    ...(await import('@mdx-js/rollup')).default({
      jsx: true,
      jsxImportSource: 'solid-js',
      providerImportSource: '@resolid/mdx',
      elementAttributeNameCase: 'html',
      rehypePlugins: [...config.rehypePlugins, rehypeSlug, rehypeCollectHeadings],
      remarkPlugins: [...config.remarkPlugins, remarkGfm],
    }),
    enforce: 'pre',
  };

  return [
    {
      ...plugin,
      async transform(code, id, transformOptions) {
        if (id.endsWith('.mdx') || id.endsWith('.md')) {
          if (cache.has(id)) {
            return cache.get(id);
          }

          // @ts-expect-error Cannot invoke
          const result = await plugin.transform(code, id, transformOptions);

          cache.set(id, result);

          return result;
        }
      },
    },
    {
      ...plugin,
      name: 'mdx-meta',
      async transform(code, id, transformOptions) {
        if (id.endsWith('.mdx?meta') || id.endsWith('.md?meta')) {
          id = id.replace(/\?meta$/, '');

          const getCode = () => {
            return `
              export const getHeadings = () => {
                return ${JSON.stringify(headingsCache.get(id), null, 2)};
              }
              `;
          };

          if (cache.has(id)) {
            return { code: getCode() };
          }

          // @ts-expect-error Cannot invoke
          const result = await plugin.transform(code, id, transformOptions);

          cache.set(id, result);

          return {
            code: getCode(),
          };
        }
      },
    },
  ] as Plugin[];
};

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
