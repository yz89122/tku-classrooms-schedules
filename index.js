import Koa from 'koa';
import { createServiceContainer } from './container/index.js';

(async () => {
  const container = createServiceContainer();
  /** @type {Koa} */
  const app = await container.resolve(Koa);
  const port = 3000;
  app.listen(port, () => console.log(`listing on port ${port}`));
})();
