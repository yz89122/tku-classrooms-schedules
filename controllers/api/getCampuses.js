import Koa from 'koa';
import ServiceContainer from '../../container/ServiceContainer.js';
import CampusesManager from '../../managers/CampusesManager.js';

/** @type {Koa.Middleware} */
export default async (ctx, next) => {
  /** @type {ServiceContainer} */
  const container = ctx.container;
  /** @type {CampusesManager} */
  const manager = await container.resolve(CampusesManager);
  ctx.body = await manager.getCampuses();
};
