import Router from '@koa/router';
import ServiceContainer from '../../container/ServiceContainer.js';
import catchError from '../middleware/api/catchError.js';
import getCampuses from '../../controllers/api/getCampuses.js';
import getClassroomsSchedules from '../../controllers/api/getClassroomsSchedules.js';

/** @type {(container: ServiceContainer) => Promise<Router>} */
export default async (container) => {
  /** @type {Router} */
  const router = await container.resolve(Router);

  router.use(catchError);

  router.get('/campuses', getCampuses);
  router.get(
    '/campus/:campus/building/:building/:year-:month-:day',
    getClassroomsSchedules
  );

  return router;
};
