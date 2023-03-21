import sirv from 'sirv';
import polka from 'polka';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { type ServerResponse, type IncomingMessage } from 'http';
import { setResponse } from '@resolid/run/node';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import manifest from '../../dist/public/route-manifest.json';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import handlerRequest from './entry-server.js';

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

  const response = handlerRequest(req, res.statusCode, headers, {
    tags: [],
    components: new Set(),
    manifest: manifest,
  });

  await setResponse(res, response);
};

const server = polka().use('/', assets).use(render);

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
