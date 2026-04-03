const fetch = require("node-fetch");
const base64url = require('base64url');
const jose = require("jsrsasign")

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

  // make sure code exists in the query params
  if (!query.code) {
    throw new Error('No auth code provided');
  }
  const response = await asClient.fetchTokens(query.code, session.codeVerifier);

  session.accessToken = response.accessToken;
  session.refreshToken = response.refreshToken;
  session.scope = response.scope;

  // the RP is responsible for id token verification
  session.idToken = await verifyIdToken(session, response.idToken);
  if(!session.idToken) {
    throw new Error('ID Token verification failed: nonce mismatch or invalid signature');
  }

  // state, nonce, codeVefifier are single-use
  delete session.state;
  delete session.nonce;
  delete session.codeVerifier;

  // the userinfo endpoint returns the user info for the given ACCESS TOKEN (not ID TOKEN)
  session.userInfo = await rsClient.getUserInfo(session.accessToken);
  if(!session.userInfo) {
    throw new Error('failed to get userInfo');
  }
};

/**
 * Verfies the id token.
 *
 * @param {} session
 * @param {*} idToken
 * @returns
 */
const verifyIdToken = async (session, idToken) => {
  // make sure the given JWT consists of `header.payload.signature`
  const idTokenSplit = idToken.split('.');
  if (idTokenSplit.length !== 3) {
    throw new Error('Invalid JWT structure: idToken must have 3 parts');
  }

  const header = JSON.parse(base64url.decode(idTokenSplit[0]));

  // check `alg` to prevent none algorithm attack
  if (header.alg !== config.rp.alg) {
    throw new Error(`Invalid algorithm: ${header.alg}. Expected ${config.rp.alg}`);
  }

  // request the PEM public key that matches the JWT header's kid
  const response = await asClient.getPublicKey(header.kid);
  const pemPublicKey = response.pemPublicKey;

  // verify the JWT signature using the fetched public key and declared algorithm
  if (!jose.jws.JWS.verify(idToken, pemPublicKey, header.alg)) {
    throw new Error('invalid ID token signature');
  }

  // id token payload
  const payload = JSON.parse(base64url.decode(idTokenSplit[1]));

  // make sure the token issuer identifies with the URI of the auth server
  if (payload.iss !== config.as.host) {
    throw new Error(`payload.iss is expected to be ${config.as.host}, but ${payload.iss}`);
  }

  // `aud` must contain or equals to the RP's cliend id
  // RFC 7519 says `aud` can be either an array of String or a single String
  if ((!Array.isArray(payload.aud) || !payload.aud.includes(config.client.clientId)) && payload.aud !== config.client.clientId) {
    throw new Error(`payload.aud is invalid`);
  }

  const now = Math.floor(Date.now() / 1000);
  const leeway = config.rp.leeway;

  // check `exp`
  if (payload.exp < (now - leeway)) {
    throw new Error('Token has expired');
  }

  // check `iat`
  if (payload.iat > (now + leeway)) {
    throw new Error('Token issued in the future');
  }

  // check `nbf` if it exists
  if (payload.nbf && payload.nbf > (now + leeway)) {
    throw new Error('Token not yet valid (nbf)');
  }

  // the nonce on the payload must identify with the nonce issued by the RP
  if (payload.nonce !== session.nonce) {
    session.nonce = null;
    throw new Error('payload.nonce is invalid');
  }

  return payload;
};

module.exports = {
  execute
};
