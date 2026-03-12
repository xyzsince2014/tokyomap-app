const fetch = require("node-fetch");

const config = require('../config');
const util = require('../utils');

/**
 * Request to the token revocation endpoint.
 *
 * @param {*} token
 */
const execute = async (token, tokenTypeHint = null) => {

  const response = await fetch(config.auth.revokeEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: util.createRequestBody({token: token, token_type_hint: tokenTypeHint}),
  });
  
  if(!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Token revocation failed: ${response.status} - ${errorBody}`);
  }
};

module.exports = {
  execute
};
