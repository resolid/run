import { lazy } from 'solid-js';
import { Navigate, type RouteDefinition } from '@resolid/run';
import { getPathname } from '~/common/utils/path';
import { components, documents } from './mdxDocuments';

const getBasename = (path: string) => {
  return getPathname(path).split('/').pop()?.split('.')[0];
};

const routes: RouteDefinition[] = [
  { path: '/', component: () => <Navigate href={'introduction'} /> },
  ...Object.keys(documents).map((key) => {
    return { path: '/' + getBasename(key), component: lazy(documents[key]) };
  }),
  ...Object.keys(components).map((key) => {
    return { path: '/components/' + getBasename(key), component: lazy(components[key]) };
  }),
  { path: '/*', component: lazy(() => import('~/portals/site/NotFound')) },
];

export default routes;
