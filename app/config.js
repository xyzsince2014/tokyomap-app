const postgres = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const as = {
  host: process.env.AUTH_CONTAINER,
  authorisation: `${process.env.DOMAIN}/auth/authorise`,
  tokenEndpoint: `${process.env.AUTH_CONTAINER}/api/v1/token`,
  publicKeysEndpoint: `${process.env.AUTH_CONTAINER}/api/v1/public-keys`,
  revokeEndpoint: `${process.env.AUTH_CONTAINER}/api/v1/revoke`,
};

const rs = {
  userInfoEndpoint: `${process.env.RESOURCE_CONTAINER}/userinfo`,
  profilesEndpoint: `${process.env.RESOURCE_CONTAINER}/profiles`
};

const rp = {
  clientName: 'tokyomap-app',
  clientUri: `${process.env.DOMAIN}`,
  redirectUris: [`${process.env.DOMAIN}/api/auth/callback`],
  responseTypes: ['code'], // what the callback should be given in the query params
  grantTypes: ['authorization_code', 'refresh_token'], // in exchange of which the callback fetches tokens
  tokenEndpointAuthMethod: 'client_secret_basic', // how the RP sends its client credentials to the token endpoint
  scope: ['openid', 'profile', 'email'],
  alg: 'RS256',
  leeway: 60 // sec
};

const client = {
  "clientId" : `${process.env.CLIENT_ID}`,
  "clientSecret" : `${process.env.CLIENT_SECRET}`,
  "clientName" : "tokyomap-app",
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
  "tokenEndpointAuthMethod" : "client_secret_basic",
  "scope" : ["openid", "profile", "email"],
  "registrationAccessToken" : `${process.env.REGISTRATION_ACCESS_TOKEN}`,
  "registrationClientUri" : `${process.env.REGISTRATION_CLIENT_URI}`,
};

module.exports = {
  postgres,
  as,
  rs,
  rp,
  client,
};
