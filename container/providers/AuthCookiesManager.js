import ServiceContainer from '../ServiceContainer.js';
import Cache from '../../utils/Cache.js';
import AuthCookiesManager from '../../managers/AuthCookiesManager.js';

/** @type {(container: ServiceContainer) => void} */
export default (container) => {
  container.singleton(
    AuthCookiesManager,
    async (container) =>
      new AuthCookiesManager({
        axios: await container.resolve('axios-for-tku-oa'),
        cache: await container.resolve(Cache),
      })
  );
};
