import type { GetModuleInfo, OutputOptions } from 'rollup';
import type { Plugin, UserConfig } from 'vite';

export type ManualChunksFunction = (id: string) => string | void | undefined | null;
type ChunkOptions = { cache?: SplitChunkCache; manualChunks?: ManualChunksFunction };

class SplitChunkCache {
  cache;

  constructor() {
    this.cache = new Map<string, boolean>();
  }

  reset() {
    this.cache = new Map<string, boolean>();
  }
}

const staticImportedByEntry = (
  id: string,
  getModuleInfo: GetModuleInfo,
  cache: Map<string, boolean>,
  importStack: string[] = []
) => {
  if (cache.has(id)) {
    return cache.get(id);
  }

  if (importStack.includes(id)) {
    cache.set(id, false);
    return false;
  }

  const mod = getModuleInfo(id);

  if (!mod) {
    cache.set(id, false);
    return false;
  }

  if (mod.isEntry) {
    cache.set(id, true);
    return true;
  }

  const someImporterIs = mod.importers.some((importer) =>
    staticImportedByEntry(importer, getModuleInfo, cache, importStack.concat(id))
  );

  cache.set(id, someImporterIs);

  return someImporterIs;
};

const splitChunk = (options: ChunkOptions = {}) => {
  const cache = options.cache ?? new SplitChunkCache();

  return (id: string, { getModuleInfo }: { getModuleInfo: GetModuleInfo }) => {
    if (
      !/\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/.test(id) &&
      staticImportedByEntry(id, getModuleInfo, cache.cache)
    ) {
      return options.manualChunks?.(id);
    }
  };
};

export const chunkSplitPlugin = ({ manualChunks }: { manualChunks?: ManualChunksFunction }): Plugin => {
  const caches: SplitChunkCache[] = [];

  const createSplitChunk = (output: OutputOptions, config: UserConfig) => {
    const cache = new SplitChunkCache();

    caches.push(cache);

    const build = config.build ?? {};
    const format = output?.format;

    if (!build.ssr && !build.lib && format !== 'umd' && format !== 'iife') {
      return splitChunk({ cache, manualChunks });
    }
  };

  // noinspection TypeScriptValidateTypes,JSUnusedGlobalSymbols
  return {
    name: 'vite-plugin-split-chunk',
    async config(userConfig) {
      let outputs = userConfig?.build?.rollupOptions?.output;

      if (outputs) {
        outputs = Array.isArray(outputs) ? outputs : [outputs];

        for (const output of outputs) {
          const manualChunks = createSplitChunk(output, userConfig);

          if (manualChunks) {
            if (output.manualChunks) {
              if (typeof output.manualChunks === 'function') {
                const userManualChunks = output.manualChunks;

                output.manualChunks = (id, api) => {
                  return userManualChunks(id, api) ?? manualChunks(id, api);
                };
              }
            } else {
              output.manualChunks = manualChunks;
            }
          }
        }
      } else {
        return {
          build: {
            rollupOptions: {
              output: {
                manualChunks: createSplitChunk({}, userConfig),
              },
            },
          },
        };
      }

      return userConfig;
    },

    buildStart() {
      caches.forEach((cache) => cache.reset());
    },
  };
};
