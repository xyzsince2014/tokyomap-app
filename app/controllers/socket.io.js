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

const socketHandler = io => {
  io.on("connection", async socket => {
    console.log(`----- A client connected -----`);

    socket.on('init', () => {
      fetchAllPosts(io);
    });

    socket.on("posted", async data => {
      console.log(`data = ${JSON.stringify(data)}`);

      const con = mysql.createConnection(dbConfig);
      try {
        await maria.beginTransaction(con);
        await maria.query(
          con,
          'INSERT INTO posts SET message = ?, user = ?, lat = ?, lng = ?, posted_at = NOW()',
          [data.message, data.user, data.lat, data.lng]
        );
        maria.commit(con);
        con.end();
      } catch (err) {
        await maria.rollback(con);
        con.end();
        console.log(`Error inserting into posts : ${err}`);
      }
      fetchPost(io);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit('disconncted');
      console.log("----- A client disconnected -----");
    });
  });
};

const fetchAllPosts = async (io) => {
  const con = mysql.createConnection(dbConfig);
    try {
      const records = await maria.query(
        con,
        "SELECT * FROM posts ORDER BY posted_at DESC LIMIT 15"
      );
      con.end();

      if(!records) {
        io.emit('fetchedAllPosts', []);
        return;
      }

      let posts = [];
      records.map(rec => {
        posts.push({
          no: rec.no,
          message: rec.message,
          user: rec.user,
          postedAt: rec.posted_at,
          lat: rec.lat,
          lng: rec.lng,
        });
      });

      io.emit('fetchedAllPosts', posts);
    } catch (err) {
      console.log(`Error in fetcing all posts : ${err}`);
    }
};

const fetchPost = async (io) => {
  const con = mysql.createConnection(dbConfig);
    try {
      const post = (await maria.query(
        con,
        "SELECT * FROM posts ORDER BY posted_at DESC LIMIT 1"
      ))[0];
      con.end();
      io.emit('fetchedPost', {
        no: rec.no,
        message: rec.message,
        user: rec.user,
        postedAt: rec.posted_at,
        lat: rec.lat,
        lng: rec.lng,
      });
    } catch (err) {
      console.log(`Error in fetcing the latest post : ${err}`);
    }
};

module.exports = {
    socketHandler,
};
