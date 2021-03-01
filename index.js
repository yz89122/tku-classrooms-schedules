import express from 'express';
import { newServiceContainer } from './container/index.js';
import { newRoutes } from './routes/index.js';

const app = express();
app.disable('x-powered-by');
app.locals.container = newServiceContainer();
app.use(newRoutes());

const port = 3000;
app.listen(port, () => console.log(`listing on port ${port}`));
