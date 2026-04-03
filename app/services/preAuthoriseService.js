const crypto = require('crypto');

const config = require('../config');
const util = require('../utils');

/**
 * Redirects the user to the authrozation endpoint of the auth server for authorization.
 *
 * @param {*} session
 * @returns
 */
const execute = session => {
  // TODO(oidc-hardening): Validate that state/nonce/codeVerifier are not already set in session to catch confused/retry states early.
  // TODO(oidc-hardening): Wrap crypto operations in try/catch to handle failures gracefully and return explicit error to controller.

  // state (32 bytes randome string) is verified by the calback endpoint
  // prevents attckers from sending their codes to the victims' user agent
  const state = crypto.randomBytes(32).toString('hex');

  // nonce (32 bytes randome string) prevents the id token replay attacks
  // the AS embeds this in the id token
  const nonce = crypto.randomBytes(32).toString('hex');;

  // PKCE Code Verifier: 43-128 chars
  // 43 bytes from randomBytes(base64url) provides high entropy
  const codeVerifier = crypto.randomBytes(43).toString('base64url');

  // PKCE Code Challenge:
  // Use irreversible SHA256
  // digest('base64url') ensures the hash is URL-safe for the auth request
  const codeChallenge = crypto
    .createHash('sha256') // todo: use config
    .update(codeVerifier)
    .digest('base64url');

  // store in session for the callback to use
  session.state = state;
  session.nonce = nonce;
  session.codeVerifier = codeVerifier;

  // TODO(oidc-hardening): Validate config.client.redirectUris[0] exists and matches registered redirect_uri at the authorization server.
  // TODO(oidc-hardening): Consider adding optional OIDC parameters such as `prompt`, `max_age`, or `login_hint` for better flow control and security posture.
  return util.buildUrl(config.as.authorisation, {
    response_type: config.rp.responseTypes[0],
    client_id: config.client.clientId,
    redirect_uri: config.client.redirectUris[0],
    code_challenge: codeChallenge,
    scope: config.client.scope.join(" "),
    state: session.state,
    code_challenge_method: 'S256',
    nonce: session.nonce,
  });
};

module.exports = {
  execute
};
