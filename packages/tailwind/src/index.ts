import { colors } from './tokens/colors';
import { fontSize } from './tokens/font-size';
import { fontFamily } from './tokens/font-family';
import { screens } from './tokens/screens';
import { borderRadius } from './tokens/border-radius';
import { fontWidth } from './tokens/font-width';
import { scrollbar } from './plugins/scrollbar';

export default {
  theme: {
    screens: screens,
    fontFamily: fontFamily,
    fontSize: fontSize,
    colors: colors,
    borderRadius: borderRadius,
    fontWeight: fontWidth,
  },
  plugins: [scrollbar],
};
