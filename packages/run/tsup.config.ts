import { defineConfig, type Options } from 'tsup';
import { dependencies, devDependencies, peerDependencies } from './package.json';
import { solidPlugin } from 'esbuild-plugin-solid';

const baseConfig: Options = {
  format: ['cjs', 'esm'],
  external: [
    ...Object.keys(peerDependencies),
    ...Object.keys(devDependencies),
    '~resolid-run/root',
    '~resolid-run/entry-server',
  ],
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
    esbuildPlugins: [solidPlugin()],
  },
  {
    ...baseConfig,
    entry: {
      browser: 'src/browser/index.tsx',
    },
  },
  {
    ...baseConfig,
    entry: {
      server: 'src/server/index.tsx',
    },
    platform: 'node',
    target: 'node16',
  },
  {
    ...baseConfig,
    entry: {
      node: 'src/node/index.ts',
    },
    platform: 'node',
    target: 'node16',
  },
  {
    ...baseConfig,
    entry: {
      vite: 'src/vite/index.ts',
    },
    platform: 'node',
    target: 'node16',
  },
]);
