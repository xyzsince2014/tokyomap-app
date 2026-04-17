const pg = require('pg'); // todo: use Sequelize.js

const config = require('../config');
const utils = require('../utils');

const pool = new pg.Pool(config.postgres);

pool.on('error', (err, client) => {
  throw new Error(`${utils.fetchCurrentDatetimeJst()} [usrDao.pool] ${err}`);
});

/**
 * Returns tweets.
 *
 * @returns tweets
 */
const getTweets = async () => {
  const client = await pool.connect();

  const q = `
    select
      tweet_id
      , sub, message
      , created_at
      , disappear_at
      , lat
      , lng
    from
      t_tweet
    where
      created_at > (now() - interval '90 minutes')
    order by
      created_at desc
    limit
      200
  `;

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
  getTweets,
  postTweet,
};
