export const FormError = Error;
export const ServerError = Error;

export type FetcherFn<T extends AnyFetchFn> = (
  payload: Parameters<T>['0'] extends undefined ? void | undefined : Parameters<T>['0'],
  opts?: FetchFnCtx
) => Promise<Awaited<FetchFnReturn<T>>>;

export type FetchFnReturn<T extends AnyFetchFn> = Awaited<ReturnType<T>> extends JsonResponse<infer R>
  ? R
  : ReturnType<T>;

export type CreateFetcherFn = <T extends AnyFetchFn>(fn: T, opts?: FetchFnCtxWithRequest) => Fetcher<T>;

export type FetcherMethods<T extends AnyFetchFn> = {
  url: string;
  fetch: (init: RequestInit, opts?: FetchFnCtxOptions) => Promise<Awaited<FetchFnReturn<T>>>;
};

export type Fetcher<T extends AnyFetchFn> = FetcherFn<T> & FetcherMethods<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyFetchFn = (payload: any, ctx: FetchFnCtxWithRequest) => any;

// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/ban-types
export type JsonResponse<T> = Response & {};

export type FetchFnCtxBase = {
  method?: 'GET' | 'POST';
};

export type FetchFnCtxOptions = FetchFnCtxBase & {
  request?: RequestInit;
  __hasRequest?: never;
};

export type FetchFnCtxWithRequest = FetchFnCtxBase & {
  request: Request;
  __hasRequest: true;
};

export type FetchFnCtx = FetchFnCtxOptions | FetchFnCtxWithRequest;
