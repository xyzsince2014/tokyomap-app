const oidcService = require("./oidcService");
const asClient = require("../clients/asClient");
const config = require('../config');

/**
 * Starts the authorisation flow.
 * Generates OIDC (state, nonce, PKCE) and per-session DPoP key material, and returns the AS /authorise URI.
 *
 * @param {Object} session the user's session
 * @returns {Promise<string>} the AS /authorise URI to redirect to
 */
const execute = async (session) => {

  const {state, nonce, codeVerifier, codeChallenge} = oidcService.generateAuthParams();
  const {privateKeyPem, publicJwk} = oidcService.generateDpopKeyPair();

  session.state = state;
  session.nonce = nonce;
  session.codeVerifier = codeVerifier;
  session.dpop = {privateKeyPem, publicJwk}

  return par(state, nonce, codeChallenge);
};

/**
 * PAR (RFC9126): pushes the authorisation request params to the AS back-channel /par endpoint, and returns the /authorise URI.
 *
 * @param {string} state
 * @param {string} nonce
 * @param {string} codeChallenge the PKCE S256 code challenge
 * @returns {Promise<string>} the AS /authorise URI with client_id and request_uri
 */
const par = async (state, nonce, codeChallenge) => {
  const {request_uri} = await asClient.pushAuthorisationRequest(state, nonce, codeChallenge);

  const asUrl = new URL(config.as.authorisation);
  asUrl.searchParams.set('client_id', config.client.clientId);
  asUrl.searchParams.set('request_uri', request_uri);

  return asUrl.toString();
};

/**
 * non-PAR: builds the classic /authorise URI with every request param in the query string.
 * Kept for reference only.
 *
 * @param {string} state
 * @param {string} nonce
 * @param {string} codeChallenge the PKCE S256 code challenge
 * @returns {string} the AS /authorise URL with all params in the query
 */
// const nonPar = (state, nonce, codeChallenge) => {
//   const asUrl = new URL(config.as.authorisation);
//   asUrl.searchParams.set('response_type', config.rp.responseTypes[0]);
//   asUrl.searchParams.set('client_id', config.client.clientId);
//   asUrl.searchParams.set('redirect_uri', config.client.redirectUris[0]);
//   asUrl.searchParams.set('code_challenge', codeChallenge);
//   asUrl.searchParams.set('code_challenge_method', 'S256');
//   asUrl.searchParams.set('scope', config.client.scope.join(" "));
//   asUrl.searchParams.set('state', state);
//   asUrl.searchParams.set('nonce', nonce);
//   return asUrl.toString();
// };

module.exports = {
  execute
};
