import { type RouteDefinition } from '@solidjs/router';
import { type Component, lazy } from 'solid-js';
import { Navigate } from '@resolid/run';
import { getPathname } from '~/common/utils/path';

const documents = import.meta.glob<boolean, string, { default: Component }>('./content/documents/*.mdx');
const components = import.meta.glob<boolean, string, { default: Component }>('./content/components/*.mdx');

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
