import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, writeFileSync } from 'fs';
import { rollup } from 'rollup';
import common from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import type { ResolidRunAdapter } from '@resolid/run/vite';

export default function (): ResolidRunAdapter {
  return {
    name: 'node',
    async build(root, outPath, ssrExternal, commonjsOptions) {
      const __dirname = dirname(fileURLToPath(import.meta.url));

      const inputEntry = join(root, '.resolid', 'server', 'server.js');

      writeFileSync(inputEntry, readFileSync(join(__dirname, 'entry.js')).toString());

      const bundle = await rollup({
        input: inputEntry,
        plugins: [
          json(),
          nodeResolve({
            preferBuiltins: true,
            exportConditions: ['node', 'solid'],
          }),
          common({ strictRequires: true, ...commonjsOptions }),
        ],
        external: [...(ssrExternal ?? [])],
      });

      await bundle.write({
        format: 'esm',
        file: join(outPath, 'server.mjs'),
        inlineDynamicImports: true,
      });

      await bundle.close();
    },
  };
}
