import { defineConfig } from 'vite';
import resolid from '@resolid/run/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    resolid({
      manualChunks(id) {
        if (id.includes('/node_modules/solid-js/') || id.includes('/node_modules/@solidjs/')) {
          return 'solid';
        }

        if (id.includes('/node_modules/@resolid/') && !id.includes('/node_modules/@resolid/run/')) {
          return 'resolid';
        }

        if (id.includes('/node_modules/')) {
          return 'vendor';
        }

        if (id.includes('/packages/') && !id.includes('/packages/run/')) {
          return 'resolid';
        }
      },
    }),
  ],
  build: {
    minify: true,
  },
});
