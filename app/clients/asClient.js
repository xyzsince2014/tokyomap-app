const fs = require('fs'); // JS file system
const fetch = require("node-fetch");
const { KJUR, KEYUTIL } = require('jsrsasign'); // JS library used for reading RSA key, signing JWT
const randomstring = require('randomstring');
const config = require('../config');

const CLIENT_ASSERTION_LIFETIME_SEC = 60;

/**
 * Builds a private_key_jwt client assertion: a JWT (containing iss, sub, aud, etc.) signed with the RP's RSA private key.
 * The IdP verifies it against the public key registered as the client's jwks (RFC 7523).
 *
 * @returns {string} the signed client_assertion JWT
 */
const buildClientAssertion = () => {
  // read the PEM private key and parse it into a key object jsrsasign can sign with
  const privateKeyPem = fs.readFileSync(config.client.privateKeyPath, 'utf8');
  const privateKey = KEYUTIL.getKey(privateKeyPem); // KEYUTIL converts PEM string to key object

  // current time in epoch seconds, used for iat and exp
  const now = KJUR.jws.IntDate.get('now'); // KJUR is util for signature generation, etc.

  // JWS header: RS256 (SHA-256 with RSA private key)
  const header = { alg: 'RS256', typ: 'JWT' };

  const payload = {
    iss: config.client.clientId,    // issuer: the client authenticating itself
    sub: config.client.clientId,    // subject: identifies the client to the IdP
    aud: config.as.tokenEndpoint,   // audience: the intended recipient (the token endpoint)
    jti: randomstring.generate(32), // unique token id, lets the IdP reject replays
    iat: now,                       // issued at
    exp: now + CLIENT_ASSERTION_LIFETIME_SEC, // short expiry to limit the replay window
  };

  // a signed JWT consisting of sign header + payload with the private key
  const clientAssertion = KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), privateKey);

  return clientAssertion;
};

/**
 * Fetches tokens from the AS token endpoint using private_key_jwt client authentication.
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
    client_assertion_type: config.as.clientAssertionType,
    client_assertion: buildClientAssertion(),
  }).toString();

  const response = await fetch(config.as.tokenEndpoint, {
    method: 'POST',
    headers: {
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
 * Revokes the given token at the IdP revocation endpoint.
 *
 * @param {string} token
 * @param {string|null} tokenTypeHint 'access_token' or 'refresh_token'
 */
const revokeToken = async (token, tokenTypeHint = null) => {
  const params = {
    token,
    client_assertion_type: config.as.clientAssertionType,
    client_assertion: buildClientAssertion(),
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
  fetchTokens,
  getPublicKey,
  revokeToken
};
