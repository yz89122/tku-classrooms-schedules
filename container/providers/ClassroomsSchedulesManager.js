import ServiceContainer from '../ServiceContainer.js';
import AuthCookiesManager from '../../managers/AuthCookiesManager.js';
import ClassroomsSchedulesManager from '../../managers/ClassroomsSchedulesManager.js';

/** @type {(container: ServiceContainer) => void} */
export default (container) => {
  container.singleton(
    ClassroomsSchedulesManager,
    async (container) =>
      new ClassroomsSchedulesManager({
        cookiesManager: await container.resolve(AuthCookiesManager),
        axios: await container.resolve('axios-for-tku-oa'),
      })
  );
};
