import { defineConfig } from 'vite';
import resolid from '@resolid/run/vite';
import inspect from 'vite-plugin-inspect';

export default defineConfig({
  plugins: [
    resolid({
      manualChunks(id) {
        if (id.includes('/node_modules/solid-js/') || id.includes('/node_modules/@solidjs/')) {
          return 'solid';
        }

        if (
          (id.includes('/packages/') && !id.includes('/packages/run/')) ||
          (id.includes('/node_modules/@resolid/') && !id.includes('/node_modules/@resolid/run/'))
        ) {
          return 'resolid';
        }

        if (id.includes('/node_modules/')) {
          return 'vendor';
        }
      },
    }),
    inspect(),
  ],
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=600',
    },
  },
});
