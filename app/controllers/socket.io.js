// const api = require('../services/api');
const mysql = require("mysql");
const maria = require("../services/maria");

// todo: use .env
const dbConfig = {
  host: 'db',
  user: 'docker',
  password: 'docker',
  database: 'tokyomap_api',
};

// todo:
// 1. store & fetch messages & locations into/from DB
// 2. fetch them from twitter streaming api
const socketHandler = io => {
  io.on("connection", async socket => {
    console.log("----- A client connected -----");

    fetchPosts(io);

    socket.on("posted", async data => {
      console.log(`data = ${JSON.stringify(data)}`);

      const con = mysql.createConnection(dbConfig);
      try {
        await maria.beginTransaction(con);
        await maria.query(
          con,
          'INSERT INTO posts SET post_text = ?, post_name = ?, posted_at = NOW()',
          [data.postText, data.postName]
        );
        maria.commit(con);
        con.end();
      } catch (err) {
        await maria.rollback(con);
        con.end();
        console.log(`Error inserting into posts : ${err}`);
      }
      fetchPosts(io);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit('disconncted');
      console.log("----- A client disconnected -----");
    });
  });
};

const fetchPosts = async (io) => {
  const con = mysql.createConnection(dbConfig);
    try {
      const posts = await maria.query(
        con,
        "SELECT * FROM posts ORDER BY posted_at DESC LIMIT 15"
      );
      con.end();
      io.emit('fetched', posts);
    } catch (err) {
      console.log(`Error in fetcing posts : ${err}`);
    }
};

module.exports = {
    socketHandler,
};
