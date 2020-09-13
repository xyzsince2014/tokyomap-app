// const api = require('../services/api');

const mysql = require("mysql");
const mysqlPromise = require("../services/maria");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

// todo:
// 1. store & fetch messages & locations into/from DB
// 2. fetch them from twitter streaming api
const socketHandler = io => {
  io.on("connection", async socket => {
    console.log("A client connected.");

    fetchPosts(io);

    socket.on("posted", async data => {
      const con = mysql.createConnection(dbConfig);
      try {
        await mysqlPromise.beginTransaction(con);
        await mysqlPromise.query(
          con,
          'INSERT INTO posts SET post_text = ?, post_name = ?, created_at = NOW()',
          [data.postText, data.postName]
        );
        mysqlPromise.commit(con);
        con.end();
      } catch (err) {
        await mysqlPromise.rollback(con);
        con.end();
        console.log(`Error inserting into chats : ${err.message}`);
      }
      fetchPosts(io);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit('disconncted');
      console.log("A client disconnected.");
    });
  });
};

const fetchPosts = async (io) => {
  const con = mysql.createConnection(dbConfig);
    try {
      const posts = await mysqlPromise.query(
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
