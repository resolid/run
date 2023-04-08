import { lazy } from 'solid-js';
import { Navigate, type RouteDefinition } from '@resolid/run';
import { getPathname } from '~/common/utils/path';
import { documents } from './mdxDocuments';

import NotFound from '~/portals/site/NotFound';

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
  { path: '/*', component: () => <NotFound class={'desktop:ps-56'} /> },
];

export default routes;
