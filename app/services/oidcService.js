const crypto = require('crypto');
const base64url = require('base64url');
const jose = require("jsrsasign");

/**
 * Generates Auth parameters.
 *
 * @returns PICK parameter
 */
const generateAuthParams = () => {
  // TODO(oidc-hardening): Validate that state/nonce/codeVerifier are not already set in session to catch confused/retry states early.
  // TODO(oidc-hardening): Wrap crypto operations in try/catch to handle failures gracefully and return explicit error to controller.  

  // state (32 bytes randome string) is verified by the calback endpoint
  // prevents attckers from sending their codes to the victims' user agent
  const state = crypto.randomBytes(32).toString('hex');

  // nonce (32 bytes randome string) prevents the id token replay attacks
  // the AS embeds this in the id token
  const nonce = crypto.randomBytes(32).toString('hex');

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

  return {state, nonce, codeVerifier, codeChallenge};
};

/**
 * Verfies the id token.
 *
 * @param {*} idToken
 * @param {*} expectedIss
 * @param {*} expectedAud
 * @param {*} expectedNonce
 * @param {*} getPublicFn (kid) => Promise<String|Object> logic
 * @param {*} expectedAlg
 * @param {*} leeway
 * @returns the payload of the id token
 */
const verifyIdToken = async ({
  idToken,
  expectedIss,
  expectedAud,
  expectedNonce,
  getPublicKeyFn,
  expectedAlg = 'RS256',
  leeway = 60,
}) => {
  // make sure the given JWT consists of `header.payload.signature`
  const idTokenSplit = idToken.split('.');
  if (idTokenSplit.length !== 3) {
    throw new Error('Invalid JWT structure');
  }

  // check the JWT header's `alg` to prevent none algorithm attack
  const header = JSON.parse(base64url.decode(idTokenSplit[0]));
  if (header.alg !== expectedAlg) {
    throw new Error(`Invalid algorithm: expected ${expectedAlg}`);
  }

  // request the PEM public key that matches the JWT header's `kid`
  const publicKey = await getPublicKeyFn(header.kid);

  // verify the JWT signature using the fetched public key and declared algorithm
  if (!jose.jws.JWS.verify(idToken, publicKey, [header.alg])) {
    throw new Error('Invalid ID token signature');
  }

  // the id token's payload
  const payload = JSON.parse(base64url.decode(idTokenSplit[1]));

  // make sure the token issuer identifies with the URI of the auth server
  if (payload.iss !== expectedIss) {
    throw new Error(`Invalid issuer: ${payload.iss}`);
  }

  // `aud` must contain or equals to the RP's cliend id
  // RFC 7519 says `aud` can be either an array of String or a single String
  const audArray = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audArray.includes(expectedAud)) {
    throw new Error('Invalid audience');
  }

  // the nonce on the payload must identify with the nonce issued by the RP
  if (payload.nonce !== expectedNonce) {
    throw new Error('Invalid nonce');
  }

  // check `exp`, `iat`, and `nbf`
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < (now - leeway)) {
    throw new Error('Token has expired');
  }
  if (payload.iat > (now + leeway)) {
    throw new Error('Token issued in the future');
  }
  if (payload.nbf && payload.nbf > (now + leeway)) {
    throw new Error('Token not yet valid (nbf)');
  }

  return payload;
};

module.exports = {
  generateAuthParams,
  verifyIdToken
};
