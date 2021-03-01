import express from 'express';
import ServiceContainer from '../../container/ServiceContainer.js';
import CampusesManager from '../../managers/CampusesManager.js';

/** @type {express.RequestHandler} */
export default async (req, res) => {
  /** @type {ServiceContainer} */
  const container = res.locals.container;
  /** @type {CampusesManager} */
  const manager = await container.resolve(CampusesManager);
  res.send(await manager.getCampuses());
};
