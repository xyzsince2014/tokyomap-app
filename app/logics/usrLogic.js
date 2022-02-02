
const usrDao = require('../daos/usrDao');
const utils = require('../utils');

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
      postedAt: rec.created_at,
      disappearAt: rec.disappear_at,
      lat: rec.lat,
      lng: rec.lng,
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

const registerUser = async user => {
  if (!user.userId || !user.userName) {
    throw new Error(`${utils.fetchCurrentDatetimeJst()} [userLogic.registerUser] invalid user`);
  }

  try {
    await usrDao.registerUser(user);
  } catch (e) {
    throw new Error(`${utils.fetchCurrentDatetimeJst()} [userLogic.registerUser] ${e}`);
  }
};

module.exports = {
  getTweets,
  postTweet,
  registerUser
};
