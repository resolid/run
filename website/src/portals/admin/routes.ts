import type { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

const routes: RouteDefinition[] = [
  {
    path: '/admin',
    component: lazy(() => import('./Layout')),
    children: [
      { path: '/', component: lazy(() => import('./Home')) },
      { path: '/*', component: lazy(() => import('./NotFound')) },
    ],
  },
];

export default routes;
