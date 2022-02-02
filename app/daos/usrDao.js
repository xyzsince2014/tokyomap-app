const pg = require('pg'); // todo: use Sequelize.js

const config = require('../config');

const pool = new pg.Pool(config.postgres);

pool.on('error', (err, client) => {
  throw new Error(`${util.fetchCurrentDatetimeJst()} [usrDao.pool] ${err}`);
});

const registerUser = async user => {
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query(
      `insert into t_usr (sub, name, picture) values ($1, $2, $3) on conflict on constraint t_usr_pkey do update set name=$4, picture=$5`,
      [user.userId, user.userName, user.profileImageUrl, user.userName, user.profileImageUrl]
    );
    await client.query('commit');
  } catch (e) {
    console.log('registerUser: ' + JSON.stringify(e));
    await client.query('rollback');
  } finally {
    await client.release();
  }
};

const getTweets = async () => {
  const client = await pool.connect();
  const q = "select t.tweet_id, u.sub, u.name, u.picture, t.message, t.created_at, t.disappear_at, t.lat, t.lng from t_tweet as t join t_usr as u using(sub) where t.created_at > (now() - interval '90 minutes') order by t.created_at limit 200";
  try {
    const records = (await client.query(q)).rows;
    await client.release();
    return records;
  } catch (e) {
    console.log('getTweets: ' + JSON.stringify(e));
  }
};

const postTweet = async ({sub, geolocation, message}) => {
  const client = await pool.connect();
  try {
    await client.query('begin');
    await client.query(
      `insert into t_tweet (sub, message, lat, lng, created_at, updated_at, disappear_at) values ($1, $2, $3, $4, now(), now(), now() + interval '90 minute')`,
      [sub, message, geolocation[0], geolocation[1]]
    );
    await client.query('commit;');
  } catch (e) {
    console.log('postTweet: ' + JSON.stringify(e));
    await client.query('rollback');
  } finally {
    await client.release();
  }
};

module.exports = {
  registerUser,
  getTweets,
  postTweet,
};
