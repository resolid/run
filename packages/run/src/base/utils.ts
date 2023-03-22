export const XResolidStatusCodeHeader = 'x-resolid-status-code';
export const XResolidLocationHeader = 'x-resolid-location';
export const XResolidResponseTypeHeader = 'x-resolid-response-type';
export const XResolidContentTypeHeader = 'x-resolid-content-type';
export const XResolidOrigin = 'x-resolid-origin';

export const LocationHeader = 'Location';
export const ContentTypeHeader = 'content-type';
export const JSONResponseType = 'application/json';

export const json = <Data>(data: Data, init: number | RequestInit = {}): Response => {
  const responseInit = typeof init === 'number' ? ({ status: init } as RequestInit) : init;

  const headers = new Headers(responseInit.headers);

  if (!headers.has(ContentTypeHeader)) {
    headers.set(ContentTypeHeader, 'application/json; charset=utf-8');
  }

  headers.set(XResolidContentTypeHeader, 'json');

  return new Response(JSON.stringify(data), {
    ...responseInit,
    headers,
  });
};

export const redirect = (url: string, init: number | ResponseInit = 302): Response => {
  const responseInit =
    typeof init === 'number' ? { status: init } : typeof init.status === 'undefined' ? { status: 302 } : init;

  if (url === '') {
    url = '/';
  }

  if (process.env.NODE_ENV === 'development') {
    if (url.startsWith('.')) {
      throw new Error('Relative URLs are not allowed in redirect');
    }
  }

  const headers = new Headers(responseInit.headers);

  headers.set(LocationHeader, url);

  return new Response(null, {
    ...responseInit,
    headers,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const eventStream = (request: Request, init: (send: (event: string, data: any) => void) => () => void) => {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const send = (event: string, data: any) => {
        controller.enqueue(encoder.encode('event: ' + event + '\n'));
        controller.enqueue(encoder.encode('data: ' + data + '\n' + '\n'));
      };

      const cleanup = init(send);

      let closed = false;
      const close = () => {
        if (closed) {
          return;
        }

        cleanup();
        closed = true;
        request.signal.removeEventListener('abort', close);
        controller.close();
      };
      request.signal.addEventListener('abort', close);
      if (request.signal.aborted) {
        close();
        return;
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isResponse = (value: any): value is Response => {
  return (
    value != null &&
    typeof value.status === 'number' &&
    typeof value.statusText === 'string' &&
    typeof value.headers === 'object' &&
    typeof value.body !== 'undefined'
  );
};

const redirectStatusCodes = new Set([204, 301, 302, 303, 307, 308]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isRedirectResponse = (response: Response | any): response is Response => {
  return response && response instanceof Response && redirectStatusCodes.has(response.status);
};
