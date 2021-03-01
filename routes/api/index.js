import express from 'express';
import notFound from '../../controllers/api/notFound.js';
import getCampuses from '../../controllers/api/getCampuses.js';
import getClassroomsSchedules from '../../controllers/api/getClassroomsSchedules.js';

export const newRoutes = () => {
  const router = express.Router();

  router.get('/campuses', getCampuses);
  router.get(
    '/campus/:campus/building/:building/:year-:month-:day',
    getClassroomsSchedules
  );

  router.use(notFound);

  return router;
};
