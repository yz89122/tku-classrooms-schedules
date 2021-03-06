import Koa from 'koa';
import Cache from '../../utils/Cache.js';
import ServiceContainer from '../../container/ServiceContainer.js';
import CampusesManager from '../../managers/CampusesManager.js';

/** @type {Koa.Middleware} */
export default async (ctx, next) => {
  /** @type {ServiceContainer} */
  const container = ctx.container;
  /** @type {Cache} */
  const cache = await container.resolve('cache');
  ctx.body = await cache.getOrElse(
    'request:campuses',
    async () => {
      /** @type {CampusesManager} */
      const manager = await container.resolve(CampusesManager);
      return await manager.requestCampuses();
    },
    5 * 1000
  );
};
