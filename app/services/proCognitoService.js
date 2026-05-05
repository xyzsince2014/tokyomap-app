const fetch = require("node-fetch");
const jose = require("jsrsasign");
const config = require('../config');
const util = require('../utils');
const oidcService = require('./oidcService');
const cognitoClient = require('../clients/cognitoClient');

/**
 * Fetches tokens from the token endpoint after authorisation, and the userInfo.
 *
 * @param {*} query
 * @param {*} session
 */
const execute = async (query, session) => {
  // error on Cognito
  if (query.error) {
    throw new Error(`Cognito Error: ${query.error}`);
  }

  // check state to prevent code injection
  if (!session.state || query.state !== session.state) {
    throw new Error('Invalid state');
  }

  // make sure auth code exists in the query params
  if (!query.code) {
    throw new Error('No auth code provided');
  }

  // token Exchange
  const response = await cognitoClient.fetchTokens(query.code, session.codeVerifier);

  session.accessToken = response.access_token;
  session.refreshToken = response.refresh_token;

  // the RP is responsible for id token verification
  session.idToken = await oidcService.verifyIdToken({
    idToken: response.id_token,
    expectedIss: config.cognito.issuer,
    expectedAud: config.cognito.clientId,
    expectedNonce: session.nonce,
    getPublicKeyFn
  });

  delete session.state;
  delete session.nonce;
  delete session.codeVerifier;

  // cognito embeds userinfo in the id token
  session.userInfo = {
    sub: session.idToken.sub,
    email: session.idToken.email,
    username: session.idToken['cognito:username'] || session.idToken.sub
  };
};

/**
 * Fetches the JWKS for Cognito.
 *
 * @param {*} kid 
 * @returns 
 */
const getPublicKeyFn = async (kid) => {
  const jwks = await cognitoClient.fetchJwks();

  const jwk = jwks.keys.find(key => key.kid === kid);
  if (!jwk) {
    throw new Error('Public key not found in Cognito JWKS');
  }

  // convert the JWK to the key object for jsrsasign
  return jose.KEYUTIL.getKey(jwk);
};

module.exports = {
  execute
};
