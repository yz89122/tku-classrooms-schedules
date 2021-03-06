import createRouter from '../../routes/index.js';
import ServiceContainer from '../ServiceContainer.js';

/** @type {(container: ServiceContainer) => void} */
export default (container) => {
  container.singleton(
    'routes',
    async (container) => await createRouter(container)
  );
};
