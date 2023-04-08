import type { RouteDefinition } from '@resolid/run';
import { lazy } from 'solid-js';

import NotFound from '~/portals/admin/NotFound';

const routes: RouteDefinition[] = [
  {
    path: '/admin',
    component: lazy(() => import('./Layout')),
    children: [
      { path: '/', component: lazy(() => import('./Home')) },
      { path: '/*', component: () => <NotFound /> },
    ],
  },
];

export default routes;
