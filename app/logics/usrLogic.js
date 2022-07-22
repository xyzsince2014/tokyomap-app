
const camelcaseKeys = require('camelcase-keys');

const usrDao = require('../daos/usrDao');
const utils = require('../utils');

const getTweets = async client => {
  console.log(`${utils.fetchCurrentDatetimeJst()} [usrLogic.getTweets]`);
  try {
    const records = await usrDao.getTweets(client);
    if(!records) {
      return [];
    }
    return records.map(r => immer.produce(camelcaseKeys(r, {deep: true}), draft => {
      draft.userName = t.name;
      draft.profileImageUrl = /^https/.test(t.picture) ? t.picture : null;
    }));
  } catch (e) {
    throw new Error(`${utils.fetchCurrentDatetimeJst()} [usrDao.getTweets] ${e}`);
  }
};

const postTweet = async (client, {sub, geolocation, message}) => {
  console.log(`${utils.fetchCurrentDatetimeJst()} [usrLogic.getTweets]`);
  if (
    !sub ||
    !geolocation[0] ||
    !geolocation[1] ||
    !message ||
    !(Buffer.byteLength(message, 'utf-8') < 256)
  ) {
    throw new Error('invalid input');
  }
  return await usrDao.postTweet(client, {sub, geolocation, message});
};


module.exports = {
  getTweets,
  postTweet
};