import { type Component } from 'solid-js';
import { type TocItem } from '~/common/mdx/TocSection';

export const documents = import.meta.glob<boolean, string, { default: Component }>('./content/**/*.mdx');

export const headings = import.meta.glob<boolean, string, TocItem[]>('./content/**/*.mdx', {
  import: 'headings',
});
