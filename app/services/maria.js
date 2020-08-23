require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

const beginTransaction = con =>
  new Promise((resolve, reject) => {
    con.beginTransaction((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

const query = (con, stmt, params) =>
  new Promise((resolve, reject) => {
    con.query(stmt, params, (err, res, flds) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(res, flds);
    });
  });

const commit = con =>
  new Promise((resolve, reject) => {
    con.commit((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

const rollback = (con, err) =>
  new Promise((resolve, reject) => {
    con.rollback(() => {
      reject(err);
    });
  });

module.exports = {
  dbConfig,
  beginTransaction,
  query,
  commit,
  rollback,
};
