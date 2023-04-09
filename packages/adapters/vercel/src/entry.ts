import { createRequest, createHeaders, setResponse } from '@resolid/run/node';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// @ts-expect-error Cannot find module
import manifest from './route-manifest.json';
// @ts-expect-error Cannot find module
import handleRequest from './entry-server.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  console.log(`Received new request: ${req.url}`);

  const host = req.headers['x-forwarded-host'] || req.headers['host'];
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const url = new URL(`${protocol}://${host}${req.url}`);

  try {
    const response = await handleRequest(createRequest(url, req), res.statusCode, createHeaders(res.getHeaders()), {
      manifest: manifest,
    });

    await setResponse(res, response);
  } catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.statusMessage = 'Internal Server Error';
    res.end();
  }
};
