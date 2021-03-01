import ServiceContainer from '../ServiceContainer.js';
import AuthCookiesManager from '../../managers/AuthCookiesManager.js';

/** @type {(container: ServiceContainer) => void} */
export const registerAuthCookiesManager = (container) => {
  container.singleton(
    AuthCookiesManager,
    async (container) =>
      new AuthCookiesManager({
        axios: await container.resolve('axios-for-tku-oa'),
      })
  );
};
