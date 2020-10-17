const mysql = require("mysql");

const maria = require("../utils/maria");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const getTweets = async () => {
  let tweets = [];
  const con = mysql.createConnection(dbConfig);

  try {
    const records = await maria.query(
      con,
      "SELECT * FROM tweets as t JOIN users AS u ON t.user_id = u.user_id WHERE posted_at > (NOW() + INTERVAL - 90 MINUTE) ORDER BY posted_at LIMIT 100"
    );
    con.end();

    if (!records) {
      return tweets;
    }

    records.map(rec => {
      tweets.push({
        tweetId: rec.tweet_id,
        userId: rec.user_id,
        userName: rec.user_name,
        profileImageUrl: rec.profile_image_url ? rec.profile_image_url : '',
        message: rec.message,
        postedAt: rec.posted_at,
        disappearAt: rec.disappear_at,
        lat: rec.lat,
        lng: rec.lng,
      });
    });
    return tweets;
  } catch (err) {
    console.log(`Error in fetcing all posts : ${err}`);
  }
};

const postTweet = async ({userId, geolocation, message}) => {
    const con = mysql.createConnection(dbConfig);
    console.log(`INSERT INTO tweets SET user_id = "${userId}", message = "${message}", posted_at = NOW(), disappear_at = (NOW() + INTERVAL 90 MINUTE), lat = ${geolocation[0]}, lng = ${geolocation[1]}`);
    try {
      await maria.beginTransaction(con);
      await maria.query(
        con,
        `INSERT INTO tweets SET user_id = "${userId}", message = "${message}", posted_at = NOW(), disappear_at = (NOW() + INTERVAL 90 MINUTE), lat = ${geolocation[0]}, lng = ${geolocation[1]}`,
      );
      maria.commit(con);
      con.end();
    } catch (err) {
      await maria.rollback(con);
      con.end();
      console.log(`Error inserting into posts : ${err}`);
    }
};

module.exports = {
  getTweets,
  postTweet
};
