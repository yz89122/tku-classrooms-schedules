import ServiceContainer from '../ServiceContainer.js';
import Cache from '../../utils/Cache.js';
import AuthCookiesManager from '../../managers/AuthCookiesManager.js';
import CampusesManager from '../../managers/CampusesManager.js';

/** @type {(container: ServiceContainer) => void} */
export default (container) => {
  container.singleton(
    CampusesManager,
    async (container) =>
      new CampusesManager({
        cookiesManager: await container.resolve(AuthCookiesManager),
        axios: await container.resolve('axios-for-tku-oa'),
        cache: await container.resolve(Cache),
      })
  );
};
