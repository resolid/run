import type { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

const routes: RouteDefinition[] = [
  {
    path: '/admin',
    component: lazy(() => import('./layouts/BaseLayout')),
    children: [
      { path: '/', component: lazy(() => import('./views/Home')) },
      { path: '/about', component: lazy(() => import('./views/About')) },
      { path: '/*', component: lazy(() => import('./views/NotFound')) },
    ],
  },
];

export default routes;
