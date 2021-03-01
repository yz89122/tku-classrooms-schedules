import ServiceContainer from '../ServiceContainer.js';
import AuthCookiesManager from '../../managers/AuthCookiesManager.js';
import CampusesManager from '../../managers/CampusesManager.js';

/** @type {(container: ServiceContainer) => void} */
export const registerCampusesManager = (container) => {
  container.singleton(
    CampusesManager,
    async (container) =>
      new CampusesManager({
        cookiesManager: await container.resolve(AuthCookiesManager),
        axios: await container.resolve('axios-for-tku-oa'),
      })
  );
};
