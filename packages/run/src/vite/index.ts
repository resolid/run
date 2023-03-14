import type { ResolidRunViteOptions } from './types';
import type { Plugin } from 'vite';
import solidVitePlugin from 'vite-plugin-solid';
import { configPlugin } from './plugins/config';
import { serverPlugin } from './plugins/server';
import { chunkSplitPlugin } from './plugins/split-chunk';

export default function resolidRun(options: ResolidRunViteOptions = {}): Plugin[] {
  const { rootEntry, clientEntry, serverEntry, manualChunks, ...solidViteOptions } = options;

  return [
    configPlugin({ rootEntry, clientEntry, serverEntry }),
    solidVitePlugin({ ...solidViteOptions, ssr: true }),
    serverPlugin(),
    manualChunks && chunkSplitPlugin({ manualChunks }),
  ].filter(Boolean) as Plugin[];
}
