import Router from '@koa/router';
import ServiceContainer from '../../container/ServiceContainer.js';

/** @type {Router.Middleware} */
export default (ctx, next) => {
  /** @type {ServiceContainer} */
  const appContainer = ctx.app.context.container;
  let requestContainer = null;
  Object.defineProperty(ctx, 'container', {
    get() {
      // lazy initialization
      if (!requestContainer) {
        requestContainer = appContainer.createSubContainer();
      }
      return requestContainer;
    },
  });
  return next();
};
