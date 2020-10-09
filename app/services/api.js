const axios = require('axios');

const DEFAULT_API_CONFIG = {
  baseURL: 'https://stream.twitter.com/1.1',
  timeout: 1000 * 10,
};

const createAxiosInstance = (optionalConfig = {}) => {
  const config = {
    ...DEFAULT_API_CONFIG,
    ...optionalConfig,
  };

  const instance = axios.create(config);

  // interceptors
  // instance.interceptors.request.use(() => {});
  // instance.interceptors.response.use(() => {});

  return instance;
};

/* ******************************************************
 * api handlers
 ****************************************************** */
const getTweetsFactory = (optionalConfig = {}) => {
  const instance = createAxiosInstance();

  const getTweets = async () => {
    try {
      const response = await instance.get('/statuses/filter.json', {
        validateStatus: status => status < 500,
        withCredentials: true,
      });

      if (response.status !== 200) {
        return false;
      }

      return response;
    } catch (err) {
      return false;
    }
  };

  return getTweets;
};

module.exports = {
  getTweetsFactory,
};
