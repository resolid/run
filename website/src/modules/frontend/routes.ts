import type { RouteDefinition } from '@solidjs/router';
import { lazy } from 'solid-js';
import { homeData } from './views/Home.data';

const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./layouts/BaseLayout')),
    children: [
      {
        path: '/',
        component: lazy(() => import('./views/Home')),
        data: homeData,
      },
      { path: '/solution', component: lazy(() => import('./views/Solution')) },
      { path: '/customers', component: lazy(() => import('./views/Customers')) },
      { path: '/pricing', component: lazy(() => import('./views/Pricing')) },
      { path: '/blog', component: lazy(() => import('./views/Blog')) },
      { path: '/about', component: lazy(() => import('./views/About')) },
      { path: '/*', component: lazy(() => import('./views/NotFound')) },
    ],
  },
];

export default routes;
