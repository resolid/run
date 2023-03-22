import { type ManifestEntry, type RunContextValue } from '../base/RunContext';

export const handleRunRequest = (
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
  return handleRequest(request, responseStatusCode, responseHeaders, {
    tags: [],
    components: new Set(),
    manifest: routerManifest,
  });
};
