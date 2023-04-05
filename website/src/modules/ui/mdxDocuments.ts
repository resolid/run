import { type Component } from 'solid-js';
import type { TocItem } from '~/common/mdx/TocSection';

export const documents = import.meta.glob<boolean, string, { default: Component }>('./content/documents/*.mdx');
export const components = import.meta.glob<boolean, string, { default: Component }>('./content/components/*.mdx');

export const headings = import.meta.glob<boolean, string, () => TocItem[]>(
  ['./content/documents/*.mdx', './content/components/*.mdx'],
  {
    import: 'getHeadings',
  }
);
