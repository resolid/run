import { type RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';

const routes: RouteDefinition[] = [
  { path: '/', component: lazy(() => import('./views/Index')) },
  { path: '/start', component: lazy(() => import('./views/Start')) },
  { path: '/*', component: lazy(() => import('./NotFound')) },
];

export default routes;
