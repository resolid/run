import { css, install } from '@twind/core';
import { twindConfig } from '@resolid/twind';
import presetTypography from '@twind/preset-typography';

const config = twindConfig({
  presets: [presetTypography()],
  preflight: css`
    body {
      @apply overflow-y-scroll bg-white text-gray-900;
    }
  `,
  ignorelist: ['stylus'],
  hash: false,
});

const tw = install(config, import.meta.env.PROD);

export const setup = () => tw;

export default tw;
