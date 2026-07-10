const fetch = require("node-fetch");
const statusCodes = require("http-status-codes");

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

  /* JAR */
  const body = new URLSearchParams({
    client_id: config.client.clientId,
    request: oidcService.buildRequestObject({state, nonce, codeChallenge}),
    client_assertion_type: config.as.clientAssertionType,
    client_assertion: oidcService.buildClientAssertion(),
  }).toString();

  /* non-JAR */
  // const body = new URLSearchParams({
  //   response_type: config.rp.responseTypes[0],
  //   client_id: config.client.clientId,
  //   redirect_uri: config.rp.redirectUris[0],
  //   scope: config.client.scope.join(' '),
  //   state,
  //   nonce,
  //   code_challenge: codeChallenge,
  //   code_challenge_method: 'S256',
  //   response_mode: 'jwt',
  //   client_assertion_type: config.as.clientAssertionType,
  //   client_assertion: oidcService.buildClientAssertion(),
  // }).toString();

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

  /* DPoP */
  // return await fetchTokensDpop({dpop, body});

  /* mTLS */
  return await fetchTokensMtls({body});
};

/**
 * Fetches tokens with DPoP.
 *
 * @param {*} param.headers
 * @param {*} param.body
 * @returns tokens
 */
const fetchTokensDpop = async ({dpop, body}) => {
  // first attempt: proof without a nonce (fresh jti)
  let response = await send({dpop, body});

  // RFC 9449 §8: DPoP-Nonce challenge — retry once with a proof carrying the server-issued nonce
  const nonce = response.headers.get('DPoP-Nonce');
  if (response.status === statusCodes.BAD_REQUEST && nonce) {
    response = await send({dpop, body, nonce});
  }

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  return await response.json();
};

const send = ({dpop, body, nonce = null}) => fetch(config.as.tokenEndpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'DPoP': oidcService.buildDpopProof({...dpop, htm: 'POST', htu: config.as.tokenEndpoint, nonce})
  },
  body,
});

/**
 * Fetches tokens with mTLS.
 *
 * @param {*} param.headers
 * @param {*} param.body
 * @returns tokens
 */
const fetchTokensMtls = async ({body}) => {
  const response = await fetch(config.as.tokenEndpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    agent: mtlsAgent.getMtlsAgent(),
    body
  });

  if (!response.ok) {
    throw new Error(`Token exchange failed: ${response.status}`);
  }

  return await response.json();
};

/**
 * Fetches the public key.
 *
 * @param {*} kid
 * @returns the public key
 */
const getPublicKey = async (kid) => {
  const response = await fetch(`${config.as.publicKeysEndpoint}?kid=${kid}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch JWKS: ${response.status}`);
  }

  return await response.json();
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
