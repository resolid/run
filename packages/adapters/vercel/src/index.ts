import type { ResolidRunAdapter } from '@resolid/run/vite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { rollup } from 'rollup';
import common from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';

export default function ({ edge = false }): ResolidRunAdapter {
  return {
    name: 'vercel',
    config() {
      if (edge) {
        return {
          ssr: {
            target: 'webworker',
          },
        };
      }
    },
    async buildEnd(root, outPath, ssrExternal, commonjsOptions) {
      const __dirname = dirname(fileURLToPath(import.meta.url));

      const inputEntry = join(root, '.resolid', 'server', 'server.js');

      writeFileSync(inputEntry, readFileSync(join(__dirname, edge ? 'entry-edge.js' : 'entry.js')).toString());

      const bundle = await rollup({
        input: inputEntry,
        plugins: [
          json(),
          nodeResolve({
            preferBuiltins: true,
            exportConditions: edge ? ['worker', 'solid'] : ['node', 'solid'],
          }),
          common({ strictRequires: true, ...commonjsOptions }),
        ],
        external: [...(ssrExternal || [])],
      });

      await bundle.write(
        edge
          ? {
              format: 'esm',
              file: join(outPath, 'index.mjs'),
              inlineDynamicImports: true,
            }
          : {
              format: 'cjs',
              file: join(outPath, 'index.cjs'),
              exports: 'auto',
              inlineDynamicImports: true,
            }
      );

      await bundle.close();

      const funcPath = join(outPath, '.vercel', 'output', 'functions', 'render.func');

      mkdirSync(funcPath, { recursive: true });

      const cache = Object.create(null);
    },
  };
}
