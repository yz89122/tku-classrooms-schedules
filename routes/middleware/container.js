import express from 'express';
import ServiceContainer from '../../container/ServiceContainer.js';

/** @type {express.RequestHandler} */
export default (req, res, next) => {
  /** @type {ServiceContainer} */
  const appContainer = req.app.locals.container;
  res.locals.container = appContainer.createSubContainer();
  next();
};
