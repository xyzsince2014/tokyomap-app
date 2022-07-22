const config = require('../config');

const pool = new pg.Pool(config.postgres);

pool.on('error', (err, client) => {
  throw new Error(`${utils.fetchCurrentDatetimeJst()} [socketService.pool] ${err}`);
});

const getClient = async () => {
  const client = await pool.connect();
  return client;
};

module.exports = {
  getClient
};
