import ServiceContainer from '../ServiceContainer.js';
import Cache from '../../utils/Cache.js';

/** @type {(container: ServiceContainer) => void} */
export const registerCache = (container) => {
  container.singleton(Cache, () => new Cache());
};
