import type {
  AnyFetchFn,
  Fetcher,
  FetcherFn,
  FetcherMethods,
  FetchFnCtxOptions,
  FetchFnCtxWithRequest,
  Serializer,
} from './types';

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

export const mergeHeaders = (...objs: (Headers | HeadersInit | undefined)[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allHeaders: any = {};

  for (const header of objs) {
    if (!header) continue;
    const headers: Headers = new Headers(header);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const [key, value] of (headers as any).entries()) {
      if (value === undefined || value === 'undefined') {
        delete allHeaders[key];
      } else {
        allHeaders[key] = value;
      }
    }
  }

  return new Headers(allHeaders);
};

export const mergeRequestInits = (...objs: (RequestInit | undefined)[]) => {
  return Object.assign({}, ...objs, {
    headers: mergeHeaders(...objs.map((o) => o && o.headers)),
  });
};

export const parseResponse = async (response: Response) => {
  if (response instanceof Response) {
    const contentType =
      response.headers.get(XResolidContentTypeHeader) || response.headers.get(ContentTypeHeader) || '';

    if (contentType.includes('json')) {
      return await response.json();
    } else if (contentType.includes('text')) {
      return await response.text();
    } else if (contentType.includes('error')) {
      const data = await response.json();
      const error = new Error(data.error.message);

      if (data.error.stack) {
        error.stack = data.error.stack;
      }
      return error;
    } else if (contentType.includes('response')) {
      if (response.status === 204 && response.headers.get(LocationHeader)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return redirect(response.headers.get(LocationHeader)!);
      }
      return response;
    } else {
      if (response.status === 200) {
        const text = await response.text();
        try {
          return JSON.parse(text);
        } catch {
          // empty
        }
      }
      if (response.status === 204 && response.headers.get(LocationHeader)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return redirect(response.headers.get(LocationHeader)!);
      }
      return response;
    }
  }

  return response;
};

export function mergeFetchOpts(...objs: (FetchFnCtxOptions | undefined)[]): FetchFnCtxWithRequest {
  return Object.assign({}, [
    ...objs,
    {
      request: mergeRequestInits(...objs.map((o) => o && o.request)),
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ]) as any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const payloadRequestInit = (payload: any, serializers: false | Serializer[]) => {
  const req: RequestInit = {};

  if (payload instanceof FormData) {
    req.body = payload;
  } else {
    req.body = JSON.stringify(
      payload,
      serializers
        ? (key, value) => {
            const serializer = serializers.find(({ apply }) => apply(value));
            if (serializer) {
              return serializer.serialize(value);
            }
            return value;
          }
        : undefined
    );

    req.headers = {
      [ContentTypeHeader]: JSONResponseType,
    };
  }

  return req;
};

export function createFetcher<T extends AnyFetchFn>(route: string, fetcherImpl: FetcherFn<T>): Fetcher<T> {
  const fetcherMethods: FetcherMethods<T> = {
    url: route,
    fetch: (request: RequestInit, ctx?: FetchFnCtxOptions) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return fetcherImpl({} as any, mergeFetchOpts({ request }, ctx));
    },
  };

  return Object.assign(fetcherImpl, fetcherMethods) as Fetcher<T>;
}

export const resolveRequestHref = (pathname: string, method: 'GET' | 'POST', payloadInit: RequestInit) => {
  const resolved =
    method.toLowerCase() === 'get' ? `${pathname}?payload=${encodeURIComponent(payloadInit.body as string)}` : pathname;

  return new URL(resolved, typeof document !== 'undefined' ? window.location.href : `http://localhost`).href;
};
