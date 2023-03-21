import { defineConfig } from '@twind/core';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetExt from '@twind/preset-ext';
import presetAgile from './presets/preset';

export * from './types/color';
export * from './types/types';

export { cx } from '@twind/core';

export const twindConfig = ({ presets = [], ...userConfig }) => {
  return defineConfig({
    presets: [presetAutoprefix(), presetExt(), presetAgile(), ...presets],
    ...userConfig,
  });
};
