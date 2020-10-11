// require("dotenv").config();
const mysql = require("mysql");

const maria = require("../utils/maria");

// todo: use ../config/maria.dbConfig
const dbConfig = {
  host: "db",
  user: "docker",
  password: "docker",
  database: "tokyomap_api",
};

const postTwitterUser = async user => {
    console.log(user);
    const con = mysql.createConnection(dbConfig);
    try {
      await maria.beginTransaction(con);
      await maria.query(con, `INSERT INTO users SET user_id="${user.userId}", user_name="${user.userName}", profile_image_url="${user.profileImageUrl}"`);
      maria.commit(con);
    } catch (err) {
      maria.rollback(con, err);
    } finally {
      con.end();
    }
};

module.exports = {
  postTwitterUser,
};
