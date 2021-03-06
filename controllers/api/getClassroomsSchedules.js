import Koa from 'koa';
import Cache from '../../utils/Cache.js';
import ServiceContainer from '../../container/ServiceContainer.js';
import ClassroomsSchedulesManager, {
  NoDataError,
} from '../../managers/ClassroomsSchedulesManager.js';

/** @type {Koa.Middleware} */
export default async (ctx, next) => {
  /** @type {ServiceContainer} */
  const container = ctx.container;
  /** @type {Cache} */
  const cache = await container.resolve('cache');
  const params = ctx.params;
  try {
    ctx.response.body = await cache.getOrElse(
      `request:classrooms-schedules:campus:${params.campus}:building:${params.building}:${params.year}-${params.month}-${params.date}`,
      async () => {
        /** @type {ClassroomsSchedulesManager} */
        const manager = await container.resolve(ClassroomsSchedulesManager);
        return await manager.requestData(params);
      },
      5 * 1000
    );
  } catch (e) {
    if (e instanceof NoDataError) {
      ctx.response.status = 404;
      return;
    }
    throw e;
  }
};
