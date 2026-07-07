const fetch = require("node-fetch");

const oidcService = require('../services/oidcService');
const config = require('../config');
const mtlsAgent = require('./mtlsAgent');

/**
 * Pushes the authorisation request params to the AS /par endpoint (RFC 9126), authenticating
 * with private_key_jwt, and returns the issued request_uri.
 *
 * @param {string} state
 * @param {string} nonce
 * @param {string} codeChallenge the PKCE S256 code challenge
 * @returns {Promise<{request_uri: string, expires_in: number}>}
 */
const pushAuthorisationRequest = async (state, nonce, codeChallenge) => {

  const body = new URLSearchParams({
    response_type: config.rp.responseTypes[0],
    client_id: config.client.clientId,
    redirect_uri: config.rp.redirectUris[0],
    scope: config.client.scope.join(' '),
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    client_assertion_type: config.as.clientAssertionType,
    client_assertion: oidcService.buildClientAssertion(),
    response_mode: 'jwt',
  }).toString();

  const response = await fetch(config.as.parEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body,
  });

  if (!response.ok) {
    throw new Error(`PAR failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetches tokens from the AS token endpoint using private_key_jwt client authentication.
 *
 * @param {*} code
 * @param {*} codeVerifier
 * @param {*} dpop
 * @returns
 */
const fetchTokens = async (code, codeVerifier, dpop) => {

  const body = new URLSearchParams({
    grant_type: config.rp.grantTypes[0],
    code,
    redirect_uri: config.rp.redirectUris[0],
    code_verifier: codeVerifier,
    client_assertion_type: config.as.clientAssertionType,
    client_assertion: oidcService.buildClientAssertion(),
  }).toString();

  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};

  // DPoP
  // headers.DPoP = oidcService.buildDpopProof({...dpop, htm: 'POST', htu: config.as.tokenEndpoint});

  // mTLS
  const options = {method: 'POST', headers, body};
  options.agent = mtlsAgent.getMtlsAgent();

  const response = await fetch(config.as.tokenEndpoint, options);

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
 * Revokes the given token at the IdP revocation endpoint.
 *
 * @param {string} token
 * @param {string|null} tokenTypeHint 'access_token' or 'refresh_token'
 */
const revokeToken = async (token, tokenTypeHint = null) => {
  const params = {
    token,
    client_assertion_type: config.as.clientAssertionType,
    client_assertion: oidcService.buildClientAssertion(),
  };
  if (tokenTypeHint) {
    params.token_type_hint = tokenTypeHint;
  }

  const response = await fetch(config.as.revokeEndpoint, {
    method: 'POST',
    headers: {
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
  pushAuthorisationRequest,
  fetchTokens,
  getPublicKey,
  revokeToken
};
