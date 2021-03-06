import Koa from 'koa';
import createRouter from '../../routes/index.js';
import ServiceContainer from '../ServiceContainer.js';

/** @type {(container: ServiceContainer) => void} */
export const registerKoa = (container) => {
  container.singleton(Koa, async (container) => {
    const app = new Koa();
    const router = createRouter();
    Object.defineProperty(app.context, 'container', { get: () => container });
    return app.use(router.routes()).use(router.allowedMethods());
  });
};
