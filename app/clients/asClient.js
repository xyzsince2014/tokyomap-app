const fetch = require("node-fetch");
const config = require('../config');
const util = require('../utils');

/**
 * Fetches tokens from the AS token endpoint.
 *
 * @param {*} code
 * @param {*} codeVerifier
 * @returns
 */
const fetchTokens = async (code, codeVerifier) => {
  const body = new URLSearchParams({
    grant_type: config.rp.grantTypes[0],
    code,
    redirect_uri: config.rp.redirectUris[0],
    code_verifier: codeVerifier,
  }).toString();

  const response = await fetch(config.as.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${util.encodeClientCredentials(config.client.clientId, config.client.clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Gets the public key.
 *
 * @param {*} kid
 * @returns
 */
const getPublicKey = async (kid) => {
  const response = await fetch(`${config.as.publicKeysEndpoint}?kid=${kid}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.status}`);
  }

  return response.json();
};

/**
 * Revokes the given token at the AS revocation endpoint.
 *
 * @param {string} token
 * @param {string|null} tokenTypeHint 'access_token' or 'refresh_token'
 */
const revokeToken = async (token, tokenTypeHint = null) => {
  const params = {token};
  if (tokenTypeHint) {
    params.token_type_hint = tokenTypeHint;
  }

  const response = await fetch(config.as.revokeEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${util.encodeClientCredentials(config.client.clientId, config.client.clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
    body: new URLSearchParams(params).toString(),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Token revocation failed: ${response.status} - ${errorBody}`);
  }
};

module.exports = {
  fetchTokens,
  getPublicKey,
  revokeToken
};
