import { css, install } from '@twind/core';
import { twindConfig } from '@resolid/twind';

const config = twindConfig({
  preflight: css`
    body {
      @apply overflow-y-scroll bg-white text-black;
    }
  `,
  ignorelist: ['stylus'],
  hash: false,
});

const tw = install(config, import.meta.env.PROD);

export const setup = () => tw;

export default tw;
