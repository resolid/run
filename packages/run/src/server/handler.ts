// noinspection JSUnusedGlobalSymbols

import { type RunContextValue } from '../components/RunContext';
import { handleFetch$, hasHandler } from './bling';

export type HandleFn = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  runContext: RunContextValue
) => Promise<Response> | Response;

export const createHandler = (handle: HandleFn) => {
  return async (
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    runContext: RunContextValue
  ) => {
    if (hasHandler(new URL(request.url).pathname)) {
      return await handleFetch$({
        request,
      });
    }

    const context: RunContextValue = {
      tags: [],
      components: new Set(),
      ...runContext,
    };

    return handle(request, responseStatusCode, responseHeaders, context);
  };
};
