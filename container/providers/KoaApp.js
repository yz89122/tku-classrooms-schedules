import Koa from 'koa';
import Router from '@koa/router';
import ServiceContainer from '../ServiceContainer.js';

/** @type {(container: ServiceContainer) => void} */
export default (container) => {
  container.singleton('koa-app', async (container) => {
    /** @type {Koa} */
    const app = await container.resolve(Koa);
    /** @type {Router} */
    const router = await container.resolve('routes');
    Object.defineProperty(app.context, 'container', { get: () => container });
    return app.use(router.routes()).use(router.allowedMethods());
  });
};
