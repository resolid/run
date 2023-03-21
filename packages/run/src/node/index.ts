import type { IncomingMessage, ServerResponse } from 'node:http';
import { Readable } from 'node:stream';
import { once } from 'node:events';
import { installPolyfills } from './polyfills';

installPolyfills();

declare module 'net' {
  interface Socket {
    encrypted?: boolean;
  }
}

declare module 'http' {
  interface IncomingMessage {
    ip?: string;
    protocol?: string;
  }
}

const getOrigin = (req: IncomingMessage): string => {
  const protocol = req.protocol || (req.socket?.encrypted && 'https') || 'http';
  const host = req.headers.host;

  return `${protocol}://${host}`;
};

export const getRequest = (req: IncomingMessage) => {
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return new Request(req.url!, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body,
    // @ts-expect-error Argument of type
    duplex: 'half',
  });
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const setResponse = async (res: ServerResponse, response: any) => {
  res.writeHead(response.status, response.headers);

  if (!response.body) {
    res.end();
    return;
  }

  const readable = Readable.from(response.body);
  readable.pipe(res);

  await once(readable, 'end');
};
