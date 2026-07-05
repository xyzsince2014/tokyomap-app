const https = require('https');
const fs = require('fs');
const config = require('../config');

let agent = null;

/**
 * Returns a shared https.Agent which presents the RP client certificate for mTLS (RFC 8705).
 */
const getMtlsAgent = () => {
  // re-use connection pool
  if (agent) {
    return agent;
  }

  agent = new https.Agent({
    cert: fs.readFileSync(config.rp.clientCertPath),
    key: fs.readFileSync(config.rp.clientKeyPath),
    rejectUnauthorized: config.rp.tlsRejectUnauthorized,
  });

  return agent;
};

module.exports = {
  getMtlsAgent
};
