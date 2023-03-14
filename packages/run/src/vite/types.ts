import type { Options as SolidViteOptions } from 'vite-plugin-solid';
import type { ManualChunksFunction } from './plugins/split-chunk';

export type ResolidRunVitePluginOptions = {
  adapter?: string;
  rootEntry?: string;
  clientEntry?: string;
  serverEntry?: string;

  manualChunks?: ManualChunksFunction;
};

export type ResolidRunViteOptions = ResolidRunVitePluginOptions & Partial<SolidViteOptions>;
