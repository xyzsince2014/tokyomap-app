const fetch = require("node-fetch");
const base64url = require('base64url');
const jose = require("jsrsasign")

const config = require('../config');
const util = require('../utils');

const execute = async (query, session) => {

  // todo: // res.render('error', {error: 'State value did not match'});
  if (query.state !== session.state) {
    console.log(`query.state = ${query.state}, session.state = ${session.state}`);
		throw new Error('Invalid state');
	}

  const response = await fetch(config.auth.tokenEndpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Authorization': `Basic ${util.encodeClientCredentials(config.client.clientId, config.client.clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: util.createRequestBody({
      grantType: config.clientMetadata.grantTypes[0],
      code: query.code,
      redirectUri: config.clientMetadata.redirectUris[0],
      codeVerifier: session.codeVerifier,
    }),
  });

  if(!response.ok) {
    throw new Error(response.status);
  }

  const responseBody = await response.json();

  session.accessToken = responseBody.accessToken;
  session.refreshToken = responseBody.refreshToken;
  session.scopes = responseBody.scopes;

  session.idToken = await verifyIdToken(session, responseBody.idToken);
  if(!session.idToken) {
    throw new Error('invalid idToken');
  }

  session.userInfo = await getUserInfo(session.accessToken);
  if(!session.userInfo) {
    throw new Error('failed to get userInfo');
  }
};

const verifyIdToken = async (session, idToken) => {
  const idTokenSplit = idToken.split('.');

  const header = JSON.parse(base64url.decode(idTokenSplit[0]));
  const response = await fetch(`${config.auth.publicKeysEndpoint}?kid=${header.kid}`, {
    method: 'GET',
    headers: {'Accept': 'application/json'},
  });

  if(!response.ok) {
    throw new Error(response.status);
  }

  const pemPublicKey = (await response.json()).pemPublicKey;

  if (!jose.jws.JWS.verify(idToken, pemPublicKey, header.alg)) {
    throw new Error('invalid ID token signature');
  }

  const payload = JSON.parse(base64url.decode(idTokenSplit[1]));

  if (payload.iss !== config.auth.host) {
    throw new Error(`payload.iss is expected to be ${config.auth.host}, but ${payload.iss}`);
  }

  if ((!Array.isArray(payload.aud) || !payload.aud.includes(config.client.clientId)) && payload.aud !== config.client.clientId) {
    throw new Error(`payload.aud is invalid`);
  }
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < now || now < payload.iat) {
    throw new Error('payload.exp is invalid');
  }
  if (payload.nonce !== session.nonce) {
    session.nonce = null;
    throw new Error('payload.nonce is invalid');
  }

  session.nonce = null;

  return payload;
};

/**
 * request userInfo with accessToken
 */
const getUserInfo = async token => {
  try {
    const response = await fetch(config.protectedResource.userInfoEndpoint,{
      method: 'GET',
      headers: {'Authorization': `Bearer ${token}`, 'Accept': 'application/json'}
    });

    if(!response.ok) {
      return null;
    }

    const userInfo = await response.json();
    return userInfo;

  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = {
  execute
};
