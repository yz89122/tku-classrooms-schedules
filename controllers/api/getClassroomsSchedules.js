import Koa from 'koa';
import Cache from '../../utils/Cache.js';
import ServiceContainer from '../../container/ServiceContainer.js';
import ClassroomsSchedulesManager from '../../managers/ClassroomsSchedulesManager.js';

/** @type {Koa.Middleware} */
export default async (ctx, next) => {
  /** @type {ServiceContainer} */
  const container = ctx.container;
  /** @type {Cache} */
  const cache = await container.resolve('cache');
  const params = ctx.params;
  ctx.body = await cache.getOrElse(
    `request:classrooms-schedules:campus:${params.campus}:building:${params.building}:${params.year}-${params.month}-${params.date}`,
    async () => {
      /** @type {ClassroomsSchedulesManager} */
      const manager = await container.resolve(ClassroomsSchedulesManager);
      return await manager.requestData(ctx.params);
    },
    5 * 1000
  );
};
