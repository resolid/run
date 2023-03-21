import type { RouteDefinition } from '@solidjs/router';
import adminRoutes from './modules/backend/routes';
import siteRoutes from './modules/frontend/routes';

const routes: RouteDefinition[] = [...adminRoutes, ...siteRoutes];

export default routes;
