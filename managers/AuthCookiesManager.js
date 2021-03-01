import axios from 'axios';
import Cache from '../utils/Cache.js';

export default class AuthCookiesManager {
  static COOKIES_TTL = 60 * 1000;

  /** @type {axios} */
  #axios = null;
  /** @type {Cache} */
  #cache = null;

  /**
   * @param {{ cookiesTTL: number, axios: axios }} param0
   */
  constructor({
    cookiesTTL = AuthCookiesManager.COOKIES_TTL,
    axios: axiosInstance,
  } = {}) {
    this.#cache = new Cache({ defaultExpiration: cookiesTTL });
    this.#axios = axiosInstance;
  }

  /**
   * @return {Promise<[string]>}
   */
  async getCookies() {
    const cookies = await this.#cache.getOrElse('auth-cookies', async () => {
      return await this.#requestCookies();
    });
    return JSON.parse(JSON.stringify(cookies));
  }

  /**
   * @return {Promise<[string]>}
   */
  async #requestCookies() {
    const response = await this.#axios.request({
      url: '/names.nsf?Login=1&Username=person&Password=personlogin',
      method: 'get',
      validateStatus: (status) => status == 302,
      maxRedirects: 0,
    });
    const header = response.headers['set-cookie'];
    return []
      .concat(header || [])
      .map((value) => value.split(';', 1)[0].trim());
  }
}
