import KoaApp from './KoaApp.js';
import Routes from './Routes.js';
import Cache from './Cache.js';
import AxiosForTkuOa from './AxiosForTkuOa.js';
import AuthCookiesManager from './AuthCookiesManager.js';
import CampusesManager from './CampusesManager.js';
import ClassroomsSchedulesManager from './ClassroomsSchedulesManager.js';

export default [
  KoaApp,
  Routes,
  Cache,
  AxiosForTkuOa,
  AuthCookiesManager,
  CampusesManager,
  ClassroomsSchedulesManager,
];
