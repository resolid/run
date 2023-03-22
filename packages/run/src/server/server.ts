// From: https://github.com/TanStack/bling/blob/main/packages/bling/src/server.ts

import type {
  AnyFetchFn,
  Deserializer,
  Fetcher,
  FetchFnCtx,
  FetchFnCtxOptions,
  FetchFnCtxWithRequest,
} from '../base/types';
import {
  ContentTypeHeader,
  createFetcher,
  isRedirectResponse,
  JSONResponseType,
  LocationHeader,
  mergeRequestInits,
  parseResponse,
  payloadRequestInit,
  resolveRequestHref,
  XResolidContentTypeHeader,
  XResolidLocationHeader,
  XResolidOrigin,
  XResolidResponseTypeHeader,
} from '../base/utils';

const deserializers: Deserializer[] = [];

export function addDeserializer(deserializer: Deserializer) {
  deserializers.push(deserializer);
}

const serverImpl = (() => {
  throw new Error('Should be compiled away');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export type ServerFetcherMethods = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createHandler(fn: AnyFetchFn, pathname: string, opts: FetchFnCtxOptions): Fetcher<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerHandler(pathname: string, handler: Fetcher<any>): void;
};

const serverMethods: ServerFetcherMethods = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createHandler: (fn: AnyFetchFn, pathname: string, defaultOpts?: FetchFnCtxOptions): Fetcher<any> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return createFetcher(pathname, async (payload: any, opts?: FetchFnCtx) => {
      const method = opts?.method || defaultOpts?.method || 'POST';

      opts = opts ?? {};

      if (!opts.__hasRequest) {
        // This will happen if the server function is called directly during SSR
        // Even though we're not crossing the network, we still need to
        // create a Request object to pass to the server function as if it was

        const payloadInit = payloadRequestInit(payload, false);

        const resolvedHref = resolveRequestHref(pathname, method, payloadInit);
        opts.request = new Request(
          resolvedHref,
          mergeRequestInits(
            {
              method: 'POST',
              headers: {
                [XResolidOrigin]: 'server',
              },
            },
            payloadInit,
            defaultOpts?.request,
            opts?.request
          )
        );
      }

      try {
        // Do the same parsing of the result as we do on the client
        const response = await fn(payload, opts as FetchFnCtxWithRequest);

        if (!opts.__hasRequest) {
          // If we're on the server during SSR, we can skip to
          // parsing the response directly
          return parseResponse(response);
        }

        // Otherwise, the client-side code will parse the response properly
        return response;
      } catch (e) {
        if (e instanceof Error && /[A-Za-z]+ is not defined/.test(e.message)) {
          const error = new Error(
            e.message +
              '\n' +
              ' You probably are using a variable defined in a closure in your server function. Make sure you pass any variables needed to the server function as arguments. These arguments must be serializable.'
          );
          error.stack = e.stack ?? '';
          throw error;
        }
        throw e;
      }
    });
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerHandler(pathname: string, handler: Fetcher<any>): any {
    handlers.set(pathname, handler);
  },
};

export const server$ = Object.assign(serverImpl, serverMethods);

export async function handleFetch$(_ctx: Omit<FetchFnCtxWithRequest, '__hasRequest'>) {
  if (!_ctx.request) {
    throw new Error('handleEvent must be called with a request.');
  }

  const ctx: FetchFnCtxWithRequest = { ..._ctx, __hasRequest: true };

  try {
    const [pathname, payload] = await parseRequest(ctx);
    const handler = getHandler(pathname);

    if (!handler) {
      // noinspection ExceptionCaughtLocallyJS
      throw {
        status: 404,
        message: 'Handler Not Found for ' + pathname,
      };
    }
    const data = await handler(payload, { ...ctx, __hasRequest: true });
    return respondWith(ctx, data, 'return');
  } catch (error) {
    return respondWith(ctx, error as Error, 'throw');
  }
}

const parseRequest = async (event: FetchFnCtxWithRequest) => {
  const request = event.request;
  const contentType = request.headers.get(ContentTypeHeader);
  const pathname = new URL(request.url).pathname;

  let payload;

  if (request.method.toLowerCase() === 'get') {
    const url = new URL(request.url);
    const params = new URLSearchParams(url.search);
    const payloadSearchStr = params.get('payload');
    if (payloadSearchStr) {
      const payloadStr = decodeURIComponent(params.get('payload') ?? '');
      payload = JSON.parse(payloadStr);
    }
  } else if (contentType) {
    // Post requests have their payload in the body
    if (contentType === JSONResponseType) {
      const text = await request.text();
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        payload = JSON.parse(text, (key: string, value: any) => {
          if (!value) {
            return value;
          }

          const deserializer = deserializers.find((d) => d.apply(value));

          if (deserializer) {
            return deserializer.deserialize(value, event);
          }

          return value;
        });
      } catch (e) {
        throw new Error(`Error parsing request body: ${text}\n ${e}`);
      }
    } else if (contentType.includes('form')) {
      payload = await request.clone().formData();
    }
  }

  return [pathname, payload];
};

const respondWith = (
  ctx: FetchFnCtxWithRequest,
  data: Response | Error | string | object,
  responseType: 'throw' | 'return'
) => {
  if (data instanceof Response) {
    if (isRedirectResponse(data) && ctx.request.headers.get(XResolidOrigin) === 'client') {
      const headers = new Headers(data.headers);

      headers.set(XResolidOrigin, 'server');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      headers.set(XResolidLocationHeader, data.headers.get(LocationHeader)!);
      headers.set(XResolidResponseTypeHeader, responseType);
      headers.set(XResolidContentTypeHeader, 'response');

      return new Response(null, {
        status: 204,
        statusText: 'Redirected',
        headers: headers,
      });
    }

    if (data.status === 101) {
      // this is a websocket upgrade, so we don't want to modify the response
      return data;
    }

    const headers = new Headers(data.headers);
    headers.set(XResolidOrigin, 'server');
    headers.set(XResolidResponseTypeHeader, responseType);
    if (!headers.has(XResolidContentTypeHeader)) {
      headers.set(XResolidContentTypeHeader, 'response');
    }

    return new Response(data.body, {
      status: data.status,
      statusText: data.statusText,
      headers,
    });
  }

  if (data instanceof Error) {
    return new Response(
      JSON.stringify({
        error: {
          stack: `This error happened inside a server function and you didn't handle it. So the client will receive an Internal Server Error. You can catch the error and throw a ServerError that makes sense for your UI. In production, the user will have no idea what the error is: \n\n${data.stack}`,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: (data as any).status,
        },
      }),
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        status: (data as any).status || 500,
        headers: {
          [XResolidResponseTypeHeader]: responseType,
          [XResolidContentTypeHeader]: 'error',
        },
      }
    );
  }

  // noinspection SuspiciousTypeOfGuard
  if (typeof data === 'object' || typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        [ContentTypeHeader]: 'application/json',
        [XResolidResponseTypeHeader]: responseType,
        [XResolidContentTypeHeader]: 'json',
      },
    });
  }

  return new Response('null', {
    status: 200,
    headers: {
      [ContentTypeHeader]: 'application/json',
      [XResolidContentTypeHeader]: 'json',
      [XResolidResponseTypeHeader]: responseType,
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlers = new Map<string, Fetcher<any>>();

export const getHandler = (pathname: string) => {
  return handlers.get(pathname);
};

export const hasHandler = (pathname: string) => {
  return handlers.has(pathname);
};
