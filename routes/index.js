import Router from '@koa/router';
import container from './middleware/container.js';
import createApiRouter from './api/index.js';

export default () => {
  const router = new Router();

  router.use(container);

  {
    const apiRouter = createApiRouter();
    router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
  }

  return router;
};
