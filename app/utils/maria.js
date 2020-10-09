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
  beginTransaction,
  query,
  commit,
  rollback,
};
