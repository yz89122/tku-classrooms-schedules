import { registerCache } from './registerCache.js';
import { registerAxiosForTkuOa } from './registerAxiosForTkuOa.js';
import { registerAuthCookiesManager } from './registerAuthCookiesManager.js';
import { registerCampusesManager } from './registerCampusesManager.js';
import { registerClassroomsSchedulesManager } from './registerClassroomsSchedulesManager.js';

export const registers = [
  registerCache,
  registerAxiosForTkuOa,
  registerAuthCookiesManager,
  registerCampusesManager,
  registerClassroomsSchedulesManager,
];
