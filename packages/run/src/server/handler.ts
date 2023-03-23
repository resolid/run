// noinspection JSUnusedGlobalSymbols

import { type ManifestEntry, type RunContextValue } from '../components/RunContext';
import { handleFetch$, hasHandler } from './bling';

export const handleRunRequest = async (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerManifest: Record<string, ManifestEntry[]>,
  handleRequest: (
    request: Request,
    responseStatusCode: number,
    responseHeaders: Headers,
    runContext: RunContextValue
  ) => Response
) => {
  if (hasHandler(new URL(request.url).pathname)) {
    return await handleFetch$({
      request,
    });
  }

  return handleRequest(request, responseStatusCode, responseHeaders, {
    tags: [],
    components: new Set(),
    manifest: routerManifest,
  });
};
