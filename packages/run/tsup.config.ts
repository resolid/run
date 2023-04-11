import { solidPlugin } from 'esbuild-plugin-solid';
import { defineConfig, type Options } from 'tsup';
import { dependencies, devDependencies, peerDependencies } from './package.json';

const baseConfig: Options = {
  format: ['cjs', 'esm'],
  external: [...Object.keys(peerDependencies), ...Object.keys(devDependencies), '~resolid-run/root'],
  noExternal: Object.keys(dependencies),
  dts: true,
  treeshake: true,
};

export default defineConfig([
  {
    ...baseConfig,
    entry: {
      index: 'src/index.tsx',
    },
    target: 'esnext',
    esbuildOptions(options) {
      options.jsx = 'preserve';

      return options;
    },
    outExtension() {
      return { js: '.jsx' };
    },
    format: ['esm'],
  },
  {
    ...baseConfig,
    entry: {
      index: 'src/index.tsx',
    },
    target: 'esnext',
    esbuildPlugins: [solidPlugin()],
  },
  {
    ...baseConfig,
    entry: {
      browser: 'src/browser/index.ts',
    },
    target: 'esnext',
  },
  {
    ...baseConfig,
    entry: {
      server: 'src/server/index.ts',
    },
    platform: 'node',
    target: 'node18',
  },
  {
    ...baseConfig,
    entry: {
      node: 'src/node/index.ts',
    },
    platform: 'node',
    target: 'node18',
  },
  {
    ...baseConfig,
    entry: {
      vite: 'src/vite/index.ts',
    },
    platform: 'node',
    target: 'node18',
  },
]);
