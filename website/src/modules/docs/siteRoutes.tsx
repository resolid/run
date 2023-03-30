import { type RouteDefinition } from '@solidjs/router';
import { type Component, lazy } from 'solid-js';
import { Navigate } from '@resolid/run';
import { getPathname } from '~/shared/utils/path';

const documents = import.meta.glob<boolean, string, { default: Component }>('./content/**/*.mdx');

const getBasename = (path: string) => {
  const paths = getPathname(path).split('/');
  const basename = paths.pop()?.split('.')[0];

  if (path.includes('/getting-started/')) {
    return basename;
  }

  return paths.pop() + '/' + basename;
};

const routes: RouteDefinition[] = [
  { path: '/', component: () => <Navigate href={'introduction'} /> },
  ...Object.keys(documents).map((key) => {
    return { path: '/' + getBasename(key), component: lazy(documents[key]) };
  }),
  { path: '/*', component: lazy(() => import('~/portals/site/NotFound')) },
];

export default routes;
