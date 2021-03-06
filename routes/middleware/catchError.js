import Router from '@koa/router';

/** @type {Router.Middleware} */
export default async (ctx, next) => {
  try {
    return await next();
  } catch (e) {
    console.error('Uncaught Error:', e);
    ctx.response.status = 500;
  }
};
