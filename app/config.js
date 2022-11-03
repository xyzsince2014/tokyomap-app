const postgres = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const auth = {
  host: process.env.AUTH_CONTAINER,
  authorisation: `${process.env.DOMAIN}/auth/authorise`,
  tokenEndpoint: `${process.env.AUTH_CONTAINER}/api/v1/token`,
  publicKeysEndpoint: `${process.env.AUTH_CONTAINER}/api/v1/public-keys`,
};

const protectedResource = {
  userInfoEndpoint: `${process.env.RESOURCE_CONTAINER}/userinfo`
};

const clientMetadata = {
  clientName: 'tokyomap-app',
  clientUri: `${process.env.DOMAIN}`,
  redirectUris: [`${process.env.DOMAIN}/api/auth/callback`],
  grantTypes: ['AUTHORISATION_CODE', 'REFRESH_TOKEN'],
  responseTypes: ['CODE', 'TOKEN'],
  tokenEndpointAuthMethod: 'CLIENT_SECRET_BASIC',
  scopes: ['openid', 'profile', 'email']
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
  "grantTypes" : ["AUTHORISATION_CODE", "REFRESH_TOKEN"],
  "responseTypes" : ["CODE", "TOKEN"],
  "tokenEndpointAuthMethod" : "CLIENT_SECRET_BASIC",
  "scopes" : ["openid", "profile", "email"],
  "registrationAccessToken" : `${process.env.REGISTRATION_ACCESS_TOKEN}`,
  "registrationClientUri" : `${process.env.REGISTRATION_CLIENT_URI}`,
};

module.exports = {
  postgres,
  auth,
  protectedResource,
  clientMetadata,
  client,
};
