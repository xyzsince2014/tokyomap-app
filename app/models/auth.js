const mysql = require("mysql");

const maria = require("../utils/maria");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const postUser = async user => {
    const con = mysql.createConnection(dbConfig);
    try {
      await maria.beginTransaction(con);
      await maria.query(con, `INSERT INTO users SET user_id="${user.userId}", user_name="${user.userName}", profile_image_url="${user.profileImageUrl}"`);
      await maria.commit(con);
    } catch (err) {
      await maria.rollback(con, err);
    } finally {
      con.end();
    }
};

module.exports = {
  postUser,
};
