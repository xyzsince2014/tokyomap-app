const crypto = require('crypto');

const oidcService = require("./oidcService");
const config = require('../config');

/**
 * Redirects the user to the authrozation endpoint of the auth server for authorization.
 *
 * @param {*} session
 * @returns AS url with parmas
 */
const execute = session => {

  const {state, nonce, codeVerifier, codeChallenge} = oidcService.generateAuthParams();
  const {privateKeyPem, publicJwk} = oidcService.generateDpopKeyPair();

  session.state = state;
  session.nonce = nonce;
  session.codeVerifier = codeVerifier;
  session.dpop = {privateKeyPem, publicJwk}

  // params for tallyme
  // TODO(oidc-hardening): Validate config.rp.redirectUris[0] exists and matches registered redirect_uri at the authorization server.
  // TODO(oidc-hardening): Consider adding optional OIDC parameters such as `prompt`, `max_age`, or `login_hint` for better flow control and security posture.
  const asUrl = new URL(config.as.authorisation);
  asUrl.searchParams.set('response_type', config.rp.responseTypes[0]);
  asUrl.searchParams.set('client_id', config.client.clientId);
  asUrl.searchParams.set('redirect_uri', config.client.redirectUris[0]);
  asUrl.searchParams.set('code_challenge', codeChallenge);
  asUrl.searchParams.set('code_challenge_method', 'S256');
  asUrl.searchParams.set('scope', config.client.scope.join(" "));
  asUrl.searchParams.set('state', state);
  asUrl.searchParams.set('nonce', nonce);

  return asUrl.toString();
};

module.exports = {
  execute
};
