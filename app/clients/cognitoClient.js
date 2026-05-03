const fetch = require("node-fetch");
const config = require('../config');
const util = require('../utils');

/**
 * Fetches tokens from the Cognito token endpoint.
 *
 * @param {*} code
 * @param {*} codeVerifier
 * @returns
 */
const fetchTokens = async (code, codeVerifier) => {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.cognito.clientId,
    code,
    redirect_uri: config.cognito.redirectUri,
    code_verifier: codeVerifier,
  }).toString();

  const response = await fetch(config.cognito.tokenEndpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${util.encodeClientCredentials(config.cognito.clientId, config.cognito.clientSecret)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Cognito Token exchange failed: ${response.status} - ${errorBody}`);
  }

  return response.json();
};

/**
 * Fetches the JWKS for Cognito.
 *
 * @returns Object (the parsed JSON of the JWKS)
 */
const fetchJwks = async () => {
  const response = await fetch(config.cognito.publicKeysEndpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch Cognito JWKS: ${response.status}`);
  }
  return response.json();
};

module.exports = {
  fetchTokens,
  fetchJwks
};
