import type { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { once } from 'node:events';
import { installPolyfills } from './polyfills';
import { type OutgoingHttpHeaders, type IncomingHttpHeaders } from 'http';

installPolyfills();

export const createRequest = (req: IncomingMessage) => {
  // noinspection HttpUrlsUsage
  const origin = req.headers.origin || `http://${req.headers.host}`;
  const url = new URL(req.url ?? '', origin);

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : req.socket
      ? (req as unknown as ReadableStream)
      : new ReadableStream({
          start(controller) {
            req.on('data', (chunk) => controller.enqueue(chunk));
            req.on('end', () => controller.close());
            req.on('error', (err) => controller.error(err));
          },
        });

  return new Request(url.href, {
    method: req.method,
    headers: createHeaders(req.headers),
    body,
    // @ts-expect-error Argument of type
    duplex: 'half',
  });
};

export const createHeaders = (outgoingHeaders: OutgoingHttpHeaders | IncomingHttpHeaders) => {
  const headers = new Headers();

  for (const [key, values] of Object.entries(outgoingHeaders)) {
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

  return headers;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const handleResponse = async (res: ServerResponse, response: any) => {
  res.writeHead(response.status, response.headers);

  if (!response.body) {
    res.end();
    return;
  }

  const readable = Readable.from(response.body);
  readable.pipe(res);

  await once(readable, 'end');
};
