import type { ViteDevServer } from 'vite';
import { createHeaders, createRequest, getUrl, setResponse } from '../../node';

export const dev = (viteServer: ViteDevServer) => {
  return () => {
    viteServer.middlewares.use(async (req, res) => {
      const url = getUrl(req);
      console.log(req.method, url.href);

      try {
        const handleRequest = (await viteServer.ssrLoadModule('~resolid-run/entry-server')).default;

        const response = await handleRequest(createRequest(url, req), res.statusCode, createHeaders(res.getHeaders()), {
          tags: [],
          components: new Set(),
          manifest: {},
        });

        await setResponse(res, response);
      } catch (e) {
        viteServer.ssrFixStacktrace(e as unknown as Error);
        console.log(e);
        res.statusCode = 500;
        res.end();
      }
    });
  };
};
