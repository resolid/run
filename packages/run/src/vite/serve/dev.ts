import type { ViteDevServer } from 'vite';
import { createHeaders, createRequest, handleResponse } from '../../node';

export const dev = (viteServer: ViteDevServer) => {
  return () => {
    viteServer.middlewares.use(async (req, res) => {
      console.log(req.method, new URL(req.url ?? '', viteServer.resolvedUrls?.local[0]).href);

      try {
        const handle = (await viteServer.ssrLoadModule('~resolid-run/entry-server')).default;

        const response = await handle(createRequest(req), res.statusCode, createHeaders(res.getHeaders()), {
          tags: [],
          components: new Set(),
          manifest: [],
        });

        await handleResponse(res, response);
      } catch (e) {
        viteServer.ssrFixStacktrace(e as unknown as Error);
        res.statusCode = 500;
        res.end();
      }
    });
  };
};
