const fetch = require("node-fetch");
const base64url = require('base64url');
const jose = require("jsrsasign")

const oidcService = require("./oidcService");
const asClient = require('../clients/asClient');
const rsClient = require('../clients/rsClient');
const config = require('../config');

/**
 * Fetches tokens from the token endpoint after authorisation, and the userInfo from the resoruce server..
 *
 * @param {*} query
 * @param {*} session
 */
const execute = async (query, session) => {
  // an error on the AS
  if (query.error) {
    throw new Error(`AS Error: ${query.error} - ${query.error_description || ''}`);
  }

  // check state to prevent code injection
  if (!session.state || query.state !== session.state) {
    console.log(`State mismatch: query.state = ${query.state}, session.state = ${session.state}`);
		throw new Error('Invalid state');
	}

  // RFC9207 verify the issuer to prevent mix-up attacks
  if (query.iss !== config.as.host) {
    throw new Error('Invalid issuer');
  }

  // make sure code exists in the query params
  if (!query.code) {
    throw new Error('No auth code provided');
  }
  const response = await asClient.fetchTokens(query.code, session.codeVerifier, session.dpop);

  session.accessToken = response.accessToken;
  session.refreshToken = response.refreshToken;
  session.scope = response.scope;

  // the RP is responsible for id token verification
  session.idToken = await oidcService.verifyIdToken({
    idToken: response.idToken,
    expectedIss: config.as.host,
    expectedAud: config.client.clientId,
    expectedNonce: session.nonce,
    expectedAlg: config.rp.alg,
    getPublicKeyFn
  });

  if(!session.idToken) {
    throw new Error('ID Token verification failed: nonce mismatch or invalid signature');
  }

  // state, nonce, codeVefifier are single-use
  delete session.state;
  delete session.nonce;
  delete session.codeVerifier;

  // the userinfo endpoint returns the user info for the given ACCESS TOKEN (not ID TOKEN)
  session.userInfo = await rsClient.getUserInfo(session.accessToken, session.dpop);
  if(!session.userInfo) {
    throw new Error('failed to get userInfo');
  }
};

/**
 * Fetches the public key from tallyme-iap.
 *
 * @param {*} kid 
 * @returns 
 */
const getPublicKeyFn = async (kid) => {
  const res = await asClient.getPublicKey(kid);
  return res.pemPublicKey;
};

module.exports = {
  execute
};
