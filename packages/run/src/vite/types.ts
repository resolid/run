import type { Options as SolidViteOptions } from 'vite-plugin-solid';
import type { ManualChunksFunction } from './plugins/split-chunk';
import type { RollupCommonJSOptions } from 'vite';

export type ResolidRunAdapter = {
  name: string;
  build: (
    root: string,
    outPath: string,
    ssrExternal: string[] | undefined,
    commonjsOptions: RollupCommonJSOptions | undefined
  ) => Promise<void>;
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
