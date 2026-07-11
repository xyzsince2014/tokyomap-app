const fs = require('fs'); // JS file system
const crypto = require('crypto');
const base64url = require('base64url');
const jose = require("jsrsasign");
const { KJUR, KEYUTIL } = require('jsrsasign'); // JS library used for reading RSA key, signing JWT
const randomstring = require('randomstring');

const config = require('../config');

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
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');

  return {state, nonce, codeVerifier, codeChallenge};
};

/**
 * Builds a private_key_jwt client assertion: a JWT (containing iss, sub, aud, etc.) signed with the RP's RSA private key.
 * The IdP verifies it against the public key registered as the client's jwks (RFC 7523).
 *
 * @returns {string} signed client_assertion JWT
 */
const buildClientAssertion = () => {

  // JWS header: RS256 (SHA-256 with RSA private key)
  const header = {alg: 'RS256', typ: 'JWT'};

  // current time in epoch seconds, used for iat and exp
  const now = KJUR.jws.IntDate.get('now'); // KJUR is util for signature generation, etc.

  const payload = {
    iss: config.client.clientId, // issuer: the client authenticating itself
    sub: config.client.clientId, // subject: identifies the client to the IdP
    aud: config.as.tokenEndpoint, // audience: the intended recipient (the token endpoint)
    jti: randomstring.generate(32), // unique token id, let the IdP reject replays
    iat: now, // issued at
    exp: now + config.as.clientAssertionLifetimeSec, // short expiry to limit the replay window
  };

  const privateKey = readPrivateKeyPEM();

  // a signed JWT consisting of sign header + payload with the private key
  const clientAssertion = KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), privateKey);

  return clientAssertion;
};

/**
 * @param {*} param0 
 * @returns {string} a signed JWT consisting of sign header + payload with the private key
 */
const buildRequestObject = ({state, nonce, codeChallenge}) => {

  // RFC 9101
  const header = {alg: 'RS256', typ: 'oauth-authz-req+jwt'};

  const payload = {
    iss: config.client.clientId,
    aud: config.as.host,
    response_type: config.rp.responseTypes[0],
    client_id: config.client.clientId,
    redirect_uri: config.rp.redirectUris[0],
    scope: config.client.scope.join(' '),
    state,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    response_mode: 'jwt'
  };

  const privateKey = readPrivateKeyPEM();

  return KJUR.jws.JWS.sign('RS256', JSON.stringify(header), JSON.stringify(payload), privateKey);
};

/**
 * Reads privateKeyPEM, and parses it into a key object jsrsasign can sign with.
 *
 * @returns the private key
 */
const readPrivateKeyPEM = () => {
  const privateKeyPem = fs.readFileSync(config.client.privateKeyPath, 'utf8');
  return KEYUTIL.getKey(privateKeyPem); // KEYUTIL converts PEM string to key object
};

/**
 * Generates a pair of DPoP keys.
 *
 * @returns DPoP key pair
 */
const generateDpopKeyPair = () => {
  // NIST P-256
  const {prvKeyObj, pubKeyObj} = jose.KEYUTIL.generateKeypair('EC', 'secp256r1');

  // serialise the private key to a PEM, which will be stored in Redis
  // PKCS8PRV is a PKCS#8 private key format
  const privateKeyPem = jose.KEYUTIL.getPEM(prvKeyObj, 'PKCS8PRV');

  // convert the public key to a JWK: {kty:'EC', crv:'P-256', x:'yUCS…', y:'N8xh…'}
  const publicJwk = jose.KEYUTIL.getJWKFromKey(pubKeyObj);

  return {privateKeyPem, publicJwk};
};

/**
 * Builds a DPoP proof JWT (RFC 9449): a short-lived JWT, signed with the session's DPoP private key, which proves possession of that key for a single HTTP request.
 *
 * @param {Object} params
 * @param {string} params.privateKeyPem the session's DPoP EC private key (PKCS#8 PEM); signs the proof (ES256)
 * @param {Object} params.publicJwk the matching public key as a JWK ({kty, crv, x, y}); embedded in the header
 * @param {string} params.htm HTTP method of the target request, bound as the `htm` claim: e.g. 'POST', 'GET'
 * @param {string} params.htu target HTTP URI without query/fragment (e.g. the token or userinfo endpoint), bound as the `htu` claim
 * @param {string|null} [params.accessToken=null] its base64url(SHA-256) hash is added as the `ath` claim to bind the proof to that access token
 * @param {string|null} params.nonce DPoP Nonce
 * @returns {string} the signed DPoP proof JWT
 */
const buildDpopProof = ({privateKeyPem, publicJwk, htm, htu, accessToken = null, nonce = null}) => {

  // read privateKeyPEM and parse it into a key object jsrsasign can sign with
  const privateKey = KEYUTIL.getKey(privateKeyPem);

  // current time in epoch seconds
  const now = KJUR.jws.IntDate.get('now');

  // JWS header: ES256
  const header = {typ: 'dpop+jwt', alg: 'ES256', jwk: publicJwk};

  const payload = {
    jti: randomstring.generate(32), // unique token id, let the IdP reject replays
    htm,
    htu,
    iat: now, // issued at
  };

  if (accessToken) {
    // Use irreversible SHA256
    // digest('base64url') ensures the hash is URL-safe for the auth request
    payload.ath = crypto.createHash('sha256').update(accessToken).digest('base64url');
  }

  if (nonce) {
    // RFC 9449 §8-9
    payload.nonce = nonce;
  }

  // sign the JWT with the private key
  const dpopProof = KJUR.jws.JWS.sign('ES256', JSON.stringify(header), JSON.stringify(payload), privateKey);

  return dpopProof;
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

/**
 * Verfies a JARM AuthZ response JWT.
 *
 * @param {*} responseJwt
 * @param {*} expectedIss
 * @param {*} expectedAud
 * @param {*} getPublicKeyFn
 * @param {*} expectedAlg
 * @param {*} leeway
 * @returns the JARM's payload
 */
const verifyJarm = async ({responseJwt, expectedIss, expectedAud, getPublicKeyFn, expectedAlg = 'RS256', leeway = 60}) => {
  const parts = responseJwt.split('.');

  if (parts.length !== 3) {
    throw new Error("Invalid JARM JWT structure");
  }

  const header = JSON.parse(base64url.decode(parts[0]));
  if (header.alg !== expectedAlg) {
    throw new Error("Invalid alg");
  }

  const publicKey = await getPublicKeyFn(header.kid);
  if (!jose.jws.JWS.verify(responseJwt, publicKey, [header.alg])) {
    throw new Error("Invalid JARM signature");
  }

  const payload = JSON.parse(base64url.decode(parts[1]));
  if (payload.iss !== expectedIss) {
    throw new Error("Invalid issuer");
  }

  // RFC 9207
  const audArr = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audArr.includes(expectedAud)) {
    throw new Error("Invalid audience");
  }

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp < (now - leeway)) {
    throw new Error("JARM response expired");
  }

  return payload;
};

module.exports = {
  generateAuthParams,
  buildClientAssertion,
  buildRequestObject,
  generateDpopKeyPair,
  buildDpopProof,
  verifyIdToken,
  verifyJarm,
};
