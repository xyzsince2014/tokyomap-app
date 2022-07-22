const utils = require('../utils');

const postUser = async user => {
  if (!user.userId || !user.userName) {
    throw new Error('invalid user');
  }

  const con = mysql.createConnection(dbConfig);
  try {
    await maria.beginTransaction(con);
    await maria.query(
      con,
      'INSERT INTO users SET user_id=?, user_name=?, profile_image_url=? ON DUPLICATE KEY UPDATE user_name=?, profile_image_url=?',
      [
        user.userId,
        user.userName,
        user.profileImageUrl,
        user.userName,
        user.profileImageUrl
      ]
    );
    await maria.commit(con);
  } catch (err) {
    await maria.rollback(con, err);
  } finally {
    con.end();
  }
};

const getTweets = async client => {
  console.log(`${utils.fetchCurrentDatetimeJst()} [usrDao.getTweets]`);
  const records = (await client.query(`select * from t_tweet as t join t_usr as u using(sub) where created_at > (now() - interval '90 minutes') order by created_at limit 200`)).rows;
  return records;
};

const postTweet = async (client, {sub, geolocation, message}) => {
  console.log(`${util.fetchCurrentDatetimeJst()} [tUsrDao.postTweet]`);
  try {
    await client.query(
      `insert into t_tweet set sub = $1, message = $2, lat = $3, lng = $4, created_at = now(), disappear_at = (now() + interval '90 minute'`,
      [sub,message, geolocation[0], geolocation[1]]
    );
    return await getTweets(client);
  } catch(e) {
    throw new Error('failed to post');
  }
};

module.exports = {
  getTweets,
  postTweet,
};
