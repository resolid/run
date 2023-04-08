import { MdxColorPalette } from './components/MdxColorPalette';
import { mdxComponents as shared } from '~/common/mdx/mdxComponents';

export const mdxComponents = {
  ...shared('UI'),
  ColorPalette: MdxColorPalette,
};
