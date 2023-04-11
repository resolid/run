import { mdxComponents as shared } from '~/common/mdx/mdxComponents';
import { MdxDemo } from '~/modules/ui/components/MdxDemo';
import { MdxColorPalette } from './components/MdxColorPalette';

export const mdxComponents = {
  ...shared('UI'),
  ColorPalette: MdxColorPalette,
  Demo: MdxDemo,
};
