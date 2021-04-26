import Router from '@koa/router';
import ServiceContainer from '../../container/ServiceContainer.js';
import getCampuses from '../../controllers/api/getCampuses.js';
import getClassroomsSchedules from '../../controllers/api/getClassroomsSchedules.js';

/** @type {(container: ServiceContainer) => Promise<Router>} */
export default async (container) => {
  const router = await container.resolve(Router);

  router.get('/campuses', getCampuses);
  router.get(
    '/campus/:campus/building/:building/:year-:month-:date',
    getClassroomsSchedules
  );

  return router;
};
