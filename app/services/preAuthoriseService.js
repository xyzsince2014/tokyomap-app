const base64url = require('base64url');
const crypto = require('crypto');
const randomstring = require("randomstring");

const config = require('../config');
const util = require('../utils');

const execute = session => {
  session.state = randomstring.generate();
  session.codeVerifier = randomstring.generate(80);
  session.nonce = randomstring.generate();

  const sha256Hash = crypto.createHash('sha256').update(session.codeVerifier);
  const hashValue = sha256Hash.digest('base64');
  const codeChallenge = base64url.fromBase64(hashValue);

  return util.buildUrl(config.auth.authorisationEndpoint, {
    responseType: 'AUTHORISATION_CODE',
    scopes: config.client.scopes.join(" "),
    clientId: config.client.clientId,
    redirectUri: config.client.redirectUris[0],
    state: session.state,
    codeChallenge,
    codeChallengeMethod: 'SHA256',
    nonce: session.nonce,
  });
};

module.exports = {
  execute
};
