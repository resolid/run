import type { RollupCommonJSOptions, UserConfig } from 'vite';
import type { Options as SolidViteOptions } from 'vite-plugin-solid';
import type { ManualChunksFunction } from './plugins/split-chunk';

export type ResolidRunAdapter = {
  name: string;
  config?: (config: UserConfig) => Promise<UserConfig> | UserConfig | undefined;
  buildEnd: (
    root: string,
    outPath: string,
    ssrExternal: string[] | undefined,
    commonjsOptions: RollupCommonJSOptions | undefined
  ) => Promise<void> | void;
};

export type ResolidRunVitePluginOptions = {
  adapter: ResolidRunAdapter;
  rootEntry?: string;
  clientEntry?: string;
  serverEntry?: string;

  inspect?: boolean;

  manualChunks?: ManualChunksFunction;
};

export type ResolidRunViteOptions = ResolidRunVitePluginOptions & Partial<Omit<SolidViteOptions, 'ssr'>>;
