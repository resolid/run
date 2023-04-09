// @ts-expect-error Cannot find module
import manifest from './route-manifest.json';
// @ts-expect-error Cannot find module
import handleRequest from './entry-server.js';

export default (req: Request) => {
  return handleRequest(req, 200, new Headers(), {
    manifest: manifest,
  });
};
