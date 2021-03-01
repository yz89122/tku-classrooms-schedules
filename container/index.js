import ServiceContainer from './ServiceContainer.js';
import { registers } from './registers/index.js';

export const newServiceContainer = () => {
  const serviceContainer = new ServiceContainer();

  for (const register of registers) {
    register(serviceContainer);
  }

  return serviceContainer;
};
