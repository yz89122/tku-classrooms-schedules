import Router from '@koa/router';
import koaLogger from 'koa-logger';
import ServiceContainer from '../container/ServiceContainer.js';
import middlewareCatchError from './middleware/catchError.js';
import middlewareContainer from './middleware/container.js';
import createApiRouter from './api/index.js';

/** @type {(container: ServiceContainer) => Promise<Router>} */
export default async (container) => {
  const router = await container.resolve(Router);

  router.use(middlewareCatchError);
  router.use(koaLogger((str, args) => args.length > 3 && console.log(...args)));
  router.use(middlewareContainer);

  {
    const apiRouter = await createApiRouter(container);
    router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
  }

  return router;
};
