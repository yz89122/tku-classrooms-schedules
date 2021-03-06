import ServiceContainer from './ServiceContainer.js';
import providers from './providers/index.js';

export const createServiceContainer = () => {
  const serviceContainer = new ServiceContainer();

  for (const provider of providers) {
    provider(serviceContainer);
  }

  return serviceContainer;
};
