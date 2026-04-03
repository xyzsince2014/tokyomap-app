const asClient = require('../clients/asClient');

/**
 * Request to the token revocation endpoint.
 *
 * @param {*} token
 */
const execute = async (token, tokenTypeHint = null) => {
  await asClient.revokeToken(token, tokenTypeHint);
};

module.exports = {
  execute
};
