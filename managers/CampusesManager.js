import axios from 'axios';
import qs from 'qs';
import cheerio from 'cheerio';
import AuthCookiesManager from './AuthCookiesManager.js';

export default class CampusesManager {
  /** @type {axios} */
  #axios = null;
  /** @type {AuthCookiesManager} */
  #cookiesManager;

  /**
   * @param {{ cookiesManager: AuthCookiesManager, axios: axios }} param0
   */
  constructor({ cookiesManager = null, axios: axiosInstance } = {}) {
    this.#cookiesManager = cookiesManager || new AuthCookiesManager();
    this.#axios = axiosInstance;
  }

  async requestCampuses() {
    const response = await this.#axios.request({
      url: '/ClassRoom.nsf/ViewOperation?OpenForm',
      method: 'get',
      headers: {
        cookie: (await this.#cookiesManager.getCookies()).join('; '),
      },
    });
    const $ = cheerio.load(response.data);
    const campuses = $('select[name="TheCampus"]')
      .children('option')
      .map((index, element) => {
        const e = $(element);
        return {
          key: e.attr('value'),
          text: e.text().trim(),
        };
      })
      .get()
      .slice(1); // remove "Please select"
    for (const campus of campuses) {
      campus.buildings = this.requestBuildings(campus);
    }
    for (const campus of campuses) {
      campus.buildings = await campus.buildings;
    }
    return campuses;
  }

  async requestBuildings(campus) {
    const response = await this.#axios.request({
      url: '/ClassRoom.nsf/ViewOperation?OpenForm',
      method: 'post',
      headers: {
        cookie: (await this.#cookiesManager.getCookies()).join('; '),
      },
      data: qs.stringify({
        __Click: '$Refresh',
        '%%Surrogate_TheCampus': 1,
        TheCampus: campus.key,
      }),
    });
    const $ = cheerio.load(response.data);
    return $('select[name="TheBuilding"]')
      .children('option')
      .map((index, element) => {
        const e = $(element);
        return {
          key: e.attr('value'),
          text: e.text().trim(),
        };
      })
      .get()
      .slice(1); // remove "Please select"
  }
}
