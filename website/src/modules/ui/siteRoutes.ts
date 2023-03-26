import { type RouteDefinition } from '@solidjs/router';
import { type Component, lazy } from 'solid-js';

const documents = import.meta.glob<boolean, string, { default: Component }>('./content/documents/*.mdx');
const components = import.meta.glob<boolean, string, { default: Component }>('./content/components/*.mdx');

const getBasename = (path: string) => {
  return new URL(path, 'http://test.test').pathname.split('/').pop()?.split('.')[0];
};

const routes: RouteDefinition[] = [
  { path: '/', component: lazy(() => import('./views/Index')) },
  ...Object.keys(documents).map((key) => {
    return { path: '/' + getBasename(key), component: lazy(documents[key]) };
  }),
  ...Object.keys(components).map((key) => {
    return { path: '/components/' + getBasename(key), component: lazy(components[key]) };
  }),
  { path: '/*', component: lazy(() => import('~/portals/site/NotFound')) },
];

export default routes;
