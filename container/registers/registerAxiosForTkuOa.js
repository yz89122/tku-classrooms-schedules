import https from 'https';
import axios from 'axios';
import ServiceContainer from '../ServiceContainer.js';

/** @type {(container: ServiceContainer) => void} */
export const registerAxiosForTkuOa = (container) => {
  container.singleton('axios-for-tku-oa', () =>
    axios.create({
      baseURL: 'https://oa.tku.edu.tw/',
      headers: {
        'user-agent':
          'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0)', // Windows XP and IE8
        accept: ['*/*'],
      },
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    })
  );
};
