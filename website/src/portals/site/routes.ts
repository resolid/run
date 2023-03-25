import type { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';
import { indexData } from '~/modules/home/views/Index.data';
import uiSiteRoutes from '~/modules/ui/siteRoutes';

const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./Layout')),
    children: [
      {
        path: '/',
        component: lazy(() => import('~/modules/home/views/Index')),
        data: indexData,
      },
      { path: '/docs', component: lazy(() => import('~/modules/docs/views/Index')) },
      { path: '/ui', component: lazy(() => import('~/modules/ui/Layout')), children: uiSiteRoutes },
      { path: '/forum', component: lazy(() => import('~/modules/forum/views/Index')) },
      { path: '/blog', component: lazy(() => import('~/modules/blog/views/Index')) },
      { path: '/about', component: lazy(() => import('~/modules/home/views/About')) },
      { path: '/*', component: lazy(() => import('./NotFound')) },
    ],
  },
];

export default routes;
