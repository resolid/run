import type { RouteDefinition } from '@solidjs/router';
import adminRoutes from '~/portals/admin/routes';
import siteRoutes from '~/portals/site/routes';

const routes: RouteDefinition[] = [...adminRoutes, ...siteRoutes];

export default routes;
