// noinspection JSUnusedGlobalSymbols

// From: https://github.com/TanStack/bling/blob/main/packages/bling/src/client.ts

import {
  mergeFetchOpts,
  mergeRequestInits,
  parseResponse,
  payloadRequestInit,
  resolveRequestHref,
  XResolidOrigin,
  XResolidResponseTypeHeader,
} from '../base/reponses';
import type {
  AnyFetchFn,
  FetcherFn,
  FetcherMethods,
  FetchFnCtxOptions,
  FetchFnCtxWithRequest,
  FetchFnReturn,
} from '../base/types';

export type CreateClientFetcherFn = <T extends AnyFetchFn>(fn: T, opts?: FetchFnCtxWithRequest) => ClientFetcher<T>;

export type CreateClientFetcherMethods = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createFetcher(route: string, defaultOpts: FetchFnCtxOptions): ClientFetcher<any>;
};

export type ClientFetcher<T extends AnyFetchFn> = FetcherFn<T> & FetcherMethods<T>;

export type ClientFetcherMethods<T extends AnyFetchFn> = FetcherMethods<T> & {
  fetch: (init: RequestInit, opts?: FetchFnCtxOptions) => Promise<Awaited<FetchFnReturn<T>>>;
};

export type ClientFetchFn = CreateClientFetcherFn & CreateClientFetcherMethods;

const fetchImpl = (() => {
  throw new Error('Should be compiled away');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

const fetchMethods: CreateClientFetcherMethods = {
  createFetcher: (pathname: string, defaultOpts?: FetchFnCtxOptions) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetcherImpl = async (payload: any = {}, opts?: FetchFnCtxOptions) => {
      const method = opts?.method || defaultOpts?.method || 'POST';

      const baseInit: RequestInit = {
        method,
        headers: {
          [XResolidOrigin]: 'client',
        },
      };

      const payloadInit = payloadRequestInit(payload);

      const resolvedHref = resolveRequestHref(pathname, method, payloadInit);

      const requestInit = mergeRequestInits(baseInit, payloadInit, defaultOpts?.request, opts?.request);
      const request = new Request(resolvedHref, requestInit);

      const response = await fetch(request);

      // // throws response, error, form error, json object, string
      if (response.headers.get(XResolidResponseTypeHeader) === 'throw') {
        throw await parseResponse(response);
      } else {
        return await parseResponse(response);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fetcherMethods: ClientFetcherMethods<any> = {
      url: pathname,
      fetch: (request: RequestInit, opts?: FetchFnCtxOptions) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return fetcherImpl({}, mergeFetchOpts({ request }, opts) as any);
      },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return Object.assign(fetcherImpl, fetcherMethods) as ClientFetcher<any>;
  },
};

export const server$: ClientFetchFn = Object.assign(fetchImpl, fetchMethods);
