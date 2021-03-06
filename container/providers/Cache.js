import ServiceContainer from '../ServiceContainer.js';
import Cache from '../../utils/Cache.js';

/** @type {(container: ServiceContainer) => void} */
export default (container) => {
  container.singleton(
    'cache',
    async (container) => await container.resolve(Cache)
  );
};
