import { defineConfig, type Preset, type TwindUserConfig } from '@twind/core';
import presetAutoprefix from '@twind/preset-autoprefix';
import presetExt from '@twind/preset-ext';
import presetResolid from './presets/preset';
import { type ResolidTheme } from './types/types';

export * from './types/color';
export * from './types/types';

export { cx } from '@twind/core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const twindConfig = <Theme = ResolidTheme, Presets extends Preset<any>[] = Preset[]>({
  presets = [] as unknown as Presets,
  ...userConfig
}: TwindUserConfig<Theme, Presets>) => {
  return defineConfig({
    // @ts-expect-error Type
    presets: [presetAutoprefix(), presetExt(), presetResolid(), ...presets],
    ...userConfig,
  });
};
