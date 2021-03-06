import axios from 'axios';
import qs from 'qs';
import cheerio from 'cheerio';
import AuthCookiesManager from './AuthCookiesManager.js';

export default class ClassroomsSchedulesManager {
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

  async requestData({ campus, building, year, month, date }) {
    const response = await this.#axios.request({
      url: '/ClassRoom.nsf/ViewOperation?OpenForm',
      method: 'post',
      baseURL: 'https://oa.tku.edu.tw/',
      headers: {
        cookie: (await this.#cookiesManager.getCookies()).join('; '),
      },
      data: qs.stringify({
        __Click:
          '4825866B000B1B60.5f6f1529bf06bd7848257157001fadf4/$Body/0.135A',
        '%%Surrogate_TheYear': '1',
        '%%Surrogate_TheMonth': '1',
        '%%Surrogate_TheDay': '1',
        '%%Surrogate_TheCampus': '1',
        '%%Surrogate_TheBuilding': '1',
        TheYear: year,
        TheMonth: month,
        TheDay: date,
        TheCampus: campus,
        TheBuilding: building,
      }),
      maxRedirects: 1,
    });
    const $ = cheerio.load(response.data);
    const text = $('body > form > p:nth-child(9)').text();
    if (text.includes('查無') || text.includes('請指定教室')) {
      throw new Error('No data');
    }
    /** @type {[{ symbol: string, description: string }]} */
    const symbols = $('body > form > p:nth-child(10) > table > tbody')
      .children()
      .map((index, element) => $(element).children().get(0))
      .get()
      .filter((e) => e.name != 'th')
      .map((node) =>
        $(node)
          .text()
          .trim()
          .split('-')
          .map((x) => x.trim())
      )
      .map((x) => ({ symbol: x[0], description: x[1] }));
    /** @type {[[string]]} */
    const table = $('body > form > p:nth-child(9) > table > tbody')
      .children()
      .map((index, element) => $(element))
      .get()
      .map((e) =>
        e
          .children()
          .map((index, element) => $(element).text().trim())
          .get()
      );
    const rooms = table.slice(2).map((
      row // the first 2 rows are the header
    ) =>
      row.reduce(
        (data, col, index) => {
          if (index <= 0) data.room_number = col;
          else if (index <= 1) data.capacity = col;
          else if (index <= 15) data.schedule[index - 2] = col;
          else if (index <= 16) data.usage = col;
          else if (index <= 17) data.equipments = col;
          else if (index <= 18) data.description = col;
          return data;
        },
        {
          room_number: null,
          capacity: null,
          schedule: new Array(14),
          usage: null,
          equipments: null,
          description: null,
        }
      )
    );
    return { symbols, rooms };
  }
}
