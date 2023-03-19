import type { ViteDevServer } from 'vite';
import { installPolyfills } from '../utils/polyfills';
import { Readable } from 'node:stream';
import { once } from 'node:events';

export const dev = (viteServer: ViteDevServer) => {
  installPolyfills();

  return () => {
    viteServer.middlewares.use(async (req, res) => {
      console.log(req.method, new URL(req.url ?? '', viteServer.resolvedUrls?.local[0]).href);

      try {
        const handle = (await viteServer.ssrLoadModule('~resolid-run/entry-server')).default;

        const headers = new Headers();

        for (const [key, values] of Object.entries(res.getHeaders())) {
          if (values) {
            if (Array.isArray(values)) {
              for (const value of values) {
                headers.append(key, value);
              }
            } else {
              headers.set(key, values.toString());
            }
          }
        }

        const response = await handle(req, res.statusCode, headers, {
          tags: [],
          components: new Set(),
          manifest: [],
        });

        res.writeHead(response.status, response.headers);

        if (!response.body) {
          res.end();
          return;
        }

        const readable = Readable.from(response.body);
        readable.pipe(res);

        await once(readable, 'end');
      } catch (e) {
        viteServer.ssrFixStacktrace(e as unknown as Error);
        res.statusCode = 500;
        res.end();
      }
    });
  };
};
