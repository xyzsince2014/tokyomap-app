
const usrDao = require('../daos/usrDao');
const utils = require('../utils');

const toLocalISOString = (date) => {
  if (!(date instanceof Date)) return date;
  const offset = 9 * 60 * 60 * 1000;
  return new Date(date.getTime() + offset).toISOString().replace('Z', '');
};

const getTweets = async () => {
  try {
    const records = await usrDao.getTweets();

    if(!records) {
      return [];
    }

    return records.map(rec => ({
      tweetId: rec.tweet_id,
      userId: rec.sub,
      userName: rec.name,
      profileImageUrl: /^https/.test(rec.picture) ? rec.picture : null,
      message: rec.message,
      postedAt: toLocalISOString(rec.created_at),
      disappearAt: toLocalISOString(rec.disappear_at),
      lat: parseFloat(rec.lat),
      lng: parseFloat(rec.lng),
    }));

  } catch (e) {
    throw new Error(`${utils.fetchCurrentDatetimeJst()} [userLogic.getTweets] ${e}`);
  }
};

const postTweet = async ({sub, geolocation, message}) => {

  if (
    !sub ||
    !geolocation[0] ||
    !geolocation[1] ||
    !message ||
    !(Buffer.byteLength(message, 'utf-8') < 256)
  ) {
    throw new Error('invalid input');
  }

  try {
    await usrDao.postTweet({sub, geolocation, message});
    return await getTweets();
  } catch (e) {
    throw new Error(`${utils.fetchCurrentDatetimeJst()} [userLogic.postTweets] ${e}`);
  }
};

module.exports = {
  getTweets,
  postTweet,
};
