import { defineConfig } from 'vitest/config';
import solid from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [solid(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: '../../tests/src/setup.ts',
    deps: {
      registerNodeLoader: true,
    },
  },
});
