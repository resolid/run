import solid from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [solid({ hot: false }), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: '../../tests/src/setup.ts',
    deps: {
      inline: [/solid-js/],
    },
    transformMode: { web: [/\.[jt]sx?$/] },
  },
});
