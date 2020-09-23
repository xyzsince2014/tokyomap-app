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

// const getTweets = () => {
//     const con = mysql.createConnection(dbConfig);
//     try {
//       await maria.beginTransaction(con);
//       await maria.query(
//         con,
//         'INSERT INTO posts SET message = ?, user = ?, lat = ?, lng = ?, posted_at = NOW()',
//         [data.message, data.user, data.lat, data.lng]
//       );
//       maria.commit(con);
//       con.end();
//     } catch (err) {
//       await maria.rollback(con);
//       con.end();
//       console.log(`Error inserting into posts : ${err}`);
//     }
// };

// const fetchPost = async (io) => {
//   const con = mysql.createConnection(dbConfig);
//     try {
//       const post = (await maria.query(
//         con,
//         "SELECT * FROM posts ORDER BY posted_at DESC LIMIT 1"
//       ))[0];
//       con.end();
//       io.emit('fetchedPost', {
//         no: rec.no,
//         message: rec.message,
//         user: rec.user,
//         postedAt: rec.posted_at,
//         lat: rec.lat,
//         lng: rec.lng,
//       });
//     } catch (err) {
//       console.log(`Error in fetcing the latest post : ${err}`);
//     }

module.exports = {
  getTweets,
};
