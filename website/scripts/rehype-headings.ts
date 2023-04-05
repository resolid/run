import { visit } from 'unist-util-visit';
import { parse } from 'acorn';
import { slugify } from '@resolid/utils';

const rehypeHeadings = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (ast: any) => {
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

    ast.children.unshift({
      type: 'mdxjsEsm',
      value: '',
      data: {
        estree: {
          body: [],
          ...parse(`export const getHeadings = () => { return ${JSON.stringify(headings)} }`, {
            sourceType: 'module',
            ecmaVersion: 'latest',
          }),
          type: 'Program',
          sourceType: 'module',
        },
      },
    });
  };
};

export default rehypeHeadings;
