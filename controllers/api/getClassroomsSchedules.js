import Koa from 'koa';
import ServiceContainer from '../../container/ServiceContainer.js';
import ClassroomsSchedulesManager from '../../managers/ClassroomsSchedulesManager.js';

/** @type {Koa.Middleware} */
export default async (ctx, next) => {
  /** @type {ServiceContainer} */
  const container = ctx.container;
  /** @type {ClassroomsSchedulesManager} */
  const manager = await container.resolve(ClassroomsSchedulesManager);
  ctx.body = await manager.requestData(ctx.params);
};
