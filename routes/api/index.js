import Router from '@koa/router';
import catchError from '../middleware/api/catchError.js';
import getCampuses from '../../controllers/api/getCampuses.js';
import getClassroomsSchedules from '../../controllers/api/getClassroomsSchedules.js';

export default () => {
  const router = new Router();

  router.use(catchError);

  router.get('/campuses', getCampuses);
  router.get(
    '/campus/:campus/building/:building/:year-:month-:day',
    getClassroomsSchedules
  );

  return router;
};
