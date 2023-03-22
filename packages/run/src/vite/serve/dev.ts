import type { ViteDevServer } from 'vite';
import { createHeaders, createRequest, setResponse } from '../../node';

export const dev = (viteServer: ViteDevServer) => {
  return () => {
    viteServer.middlewares.use(async (req, res) => {
      console.log(req.method, new URL(req.url ?? '', viteServer.resolvedUrls?.local[0]).href);

      try {
        const handleRunRequest = (await viteServer.ssrLoadModule('@resolid/run/server')).handleRunRequest;
        const handleRequest = (await viteServer.ssrLoadModule('~resolid-run/entry-server')).default;

        const response = await handleRunRequest(
          createRequest(req),
          res.statusCode,
          createHeaders(res.getHeaders()),
          {},
          handleRequest
        );

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
