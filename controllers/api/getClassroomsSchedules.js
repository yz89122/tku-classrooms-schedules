import express from 'express';
import ServiceContainer from '../../container/ServiceContainer.js';
import ClassroomsSchedulesManager from '../../managers/ClassroomsSchedulesManager.js';

/** @type {express.RequestHandler} */
export default async (req, res) => {
  /** @type {ServiceContainer} */
  const container = res.locals.container;
  /** @type {ClassroomsSchedulesManager} */
  const manager = await container.resolve(ClassroomsSchedulesManager);
  res.send(await manager.requestData(req.params));
};
