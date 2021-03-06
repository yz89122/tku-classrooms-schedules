import { registerKoa } from './registerKoa.js';
import { registerCache } from './registerCache.js';
import { registerAxiosForTkuOa } from './registerAxiosForTkuOa.js';
import { registerAuthCookiesManager } from './registerAuthCookiesManager.js';
import { registerCampusesManager } from './registerCampusesManager.js';
import { registerClassroomsSchedulesManager } from './registerClassroomsSchedulesManager.js';

export const registers = [
  registerKoa,
  registerCache,
  registerAxiosForTkuOa,
  registerAuthCookiesManager,
  registerCampusesManager,
  registerClassroomsSchedulesManager,
];
