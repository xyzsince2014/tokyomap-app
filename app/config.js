/* DB */
const postgres = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

/* tallyme */
const as = {
  host: process.env.IDP_DOMAIN,
  authorisation: `${process.env.IDP_DOMAIN}/authorise`,
  tokenEndpoint: `${process.env.IDP_DOMAIN}/api/v1/token`,
  publicKeysEndpoint: `${process.env.IDP_DOMAIN}/api/v1/public-keys`,
  revokeEndpoint: `${process.env.IDP_DOMAIN}/api/v1/revoke`,
  // RFC 7523 §2.2: fixed identifier declaring client_assertion is a JWT Bearer assertion
  clientAssertionType: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
  clientAssertionLifetimeSec: 60,
};

const rs = {
  userInfoEndpoint: `${process.env.RESOURCE_DOMAIN}/userinfo`,
  profilesEndpoint: `${process.env.RESOURCE_DOMAIN}/profiles`
};

const rp = {
  clientName: 'tokyomap-bff',
  clientUri: `${process.env.DOMAIN}`,
  redirectUris: [`${process.env.DOMAIN}/api/auth/callback`],
  responseTypes: ['code'], // what the callback should be given in the query params
  grantTypes: ['authorization_code', 'refresh_token'], // in exchange of which the callback fetches tokens
  tokenEndpointAuthMethod: 'private_key_jwt', // how the RP authenticates to the token endpoint (signed JWT, RFC 7523)
  scope: ['openid', 'profile', 'email'],
  alg: 'RS256',
  leeway: 60 // sec
};

const client = {
  "clientId" : `${process.env.CLIENT_ID}`,
  "clientSecret" : `${process.env.CLIENT_SECRET}`,
  "clientName" : "tokyomap-bff",
  "clientUri" : `${process.env.DOMAIN}`,
  "redirectUris" : [`${process.env.DOMAIN}/api/auth/callback`],
  "logoUri" : null,
  "contacts" : null,
  "tosUri" : null,
  "policyUri" : null,
  "jwksUri" : null,
  "softwareId" : null,
  "softwareVersion" : null,
  "responseTypes" : ["code"],
  "grantTypes" : ["authorization_code", "refresh_token"],
  "tokenEndpointAuthMethod" : "private_key_jwt",
  "scope" : ["openid", "profile", "email"],
  "registrationAccessToken" : `${process.env.REGISTRATION_ACCESS_TOKEN}`,
  "registrationClientUri" : `${process.env.REGISTRATION_CLIENT_URI}`,
  // path to the PEM issued by tallyme-admin, used to sign the private_key_jwt client_assertion
  "privateKeyPath" : `${process.env.CLIENT_PRIVATE_KEY_PATH}`,
};

/* Cognito */
const cognito = {
  authorisation: `${process.env.COGNITO_DOMAIN}/oauth2/authorize`,
  tokenEndpoint: `${process.env.COGNITO_DOMAIN}/oauth2/token`,
  publicKeysEndpoint: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  clientId: process.env.COGNITO_CLIENT_ID,
  clientSecret: process.env.COGNITO_CLIENT_SECRET,
  redirectUri: `${process.env.DOMAIN}/api/cognito/callback`,
  issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`,
  scope: ['openid', 'profile', 'email'],
  responseTypes: ['code'],
};

module.exports = {
  postgres,
  as,
  rs,
  rp,
  client,
  cognito
};
