import express from 'express';
import morgan from 'morgan';
import container from './middleware/container.js';
import { newRoutes as newApiRoutes } from './api/index.js';

export const newRoutes = () => {
  const router = express.Router();

  router.use(morgan('combined'));
  router.use(container);

  router.use('/api', newApiRoutes());

  return router;
};
