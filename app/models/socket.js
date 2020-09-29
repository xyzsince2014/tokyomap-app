const mysql = require("mysql");
const maria = require("../utils/maria");
const cors = require("cors");

// todo: use ../config/maria.dbConfig
const dbConfig = {
  host: "db",
  user: "docker",
  password: "docker",
  database: "tokyomap_api",
};

const getTweets = async () => {
  let tweets = [];
  const con = mysql.createConnection(dbConfig);

  try {
    const records = await maria.query(
      con,
      "SELECT * FROM tweets ORDER BY posted_at DESC LIMIT 50"
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
        message: rec.message,
        postedAt: rec.posted_at,
        lat: rec.lat,
        lng: rec.lng,
      });
    });
    return tweets;
  } catch (err) {
    console.log(`Error in fetcing all posts : ${err}`);
  }
};

const updateTweets = async ({ tweet, userId }) => {
    const con = mysql.createConnection(dbConfig);
    try {
      await maria.beginTransaction(con);
      await maria.query(
        con,
        `INSERT INTO tweets SET user_id = ${userId}, user_name = "${tweet.userName}", message = "${tweet.message}", posted_at = NOW(), lat = ${tweet.lat}, lng = ${tweet.lng}`,
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
  updateTweets
};
