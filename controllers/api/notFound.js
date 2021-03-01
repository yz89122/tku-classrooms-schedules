import express from 'express';

/** @type {express.RequestHandler} */
export default (req, res) => {
  res.status(404).end();
};
