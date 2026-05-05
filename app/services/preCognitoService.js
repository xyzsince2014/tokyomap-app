const config = require('../config');
const oidcService = require('./oidcService');

/**
 * Redirects the user to the authrozation endpoint of the auth server for authorization.
 *
 * @param {*} session
 * @returns
 */
const execute = session => {
  const {state, nonce, codeVerifier, codeChallenge} = oidcService.generateAuthParams();

  session.state = state;
  session.nonce = nonce;
  session.codeVerifier = codeVerifier;

  // prames for Cognito
  const asUrl = new URL(config.cognito.authorisation);
  asUrl.searchParams.set('response_type', config.cognito.responseTypes[0]);
  asUrl.searchParams.set('client_id', config.cognito.clientId);
  asUrl.searchParams.set('redirect_uri', config.cognito.redirectUri);
  asUrl.searchParams.set('code_challenge', codeChallenge);
  asUrl.searchParams.set('code_challenge_method', 'S256');
  asUrl.searchParams.set('scope', config.cognito.scope.join(" "));
  asUrl.searchParams.set('state', state);
  asUrl.searchParams.set('nonce', nonce);

  return asUrl.toString();
};

module.exports = {
  execute
};
