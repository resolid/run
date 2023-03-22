import sirv from 'sirv';
import polka from 'polka';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { type ServerResponse, type IncomingMessage } from 'http';
import { setResponse, createRequest, createHeaders } from '@resolid/run/node';
import { handleRunRequest } from '@resolid/run/server';

// @ts-expect-error Cannot find module
import manifest from '../../dist/public/route-manifest.json';
// @ts-expect-error Cannot find module
import handleRequest from './entry-server.js';

const { PORT = 3000 } = process.env;

const __dirname = dirname(fileURLToPath(import.meta.url));

const assets = sirv(join(__dirname, '/public'), {
  setHeaders: (res, pathname) => {
    const isAsset = pathname.startsWith('/assets/');

    if (isAsset) {
      res.setHeader('cache-control', 'public, immutable, max-age=31536000');
    }
  },
});

const render = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const response = handleRunRequest(
      createRequest(req),
      res.statusCode,
      createHeaders(res.getHeaders()),
      manifest,
      handleRequest
    );

    await setResponse(res, response);
  } catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.statusMessage = 'Internal Server Error';
    res.end();
  }
};

const server = polka().use('/', assets).use(render);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
