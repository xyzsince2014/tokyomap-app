const postgres = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

const auth = {
  host: process.env.AUTH_DOMAIN,
  authorisationEndpoint: `${process.env.AUTH_DOMAIN_LOCALHOST}/authorise`, // use "localhost" for communications via browsers
  tokenEndpoint: `${process.env.AUTH_DOMAIN}/api/v1/token`,
  publicKeysEndpoint: `${process.env.AUTH_DOMAIN}/api/v1/public-keys`,
};

const protectedResource = {
  userInfoEndpoint: `${process.env.RESOURCE_DOMAIN}/userinfo`
};

/**
 * register the client beforehand by
 * curl -X POST -d '{"client": {"clientName":"tokyomap-app","clientUri":"https://localhost","redirectUris":["https://localhost/api/auth/callback"],"grantTypes":["AUTHORISATION_CODE","REFRESH_TOKEN"],"responseTypes":["CODE","TOKEN"],"tokenEndpointAuthMethod":"CLIENT_SECRET_BASIC","scopes":["openid","profile","email"]}}' -H "Content-Type: application/json" -H "Accept: application/json" 'http://localhost:8080/api/v1/register' 
 * 
 * use its response as client below
 */
const clientMetadata = {
  clientName: 'tokyomap-app',
  clientUri: 'https://localhost',
  redirectUris: ['https://localhost/api/auth/callback'],
  grantTypes: ['AUTHORISATION_CODE', 'REFRESH_TOKEN'],
  responseTypes: ['CODE', 'TOKEN'],
  tokenEndpointAuthMethod: 'CLIENT_SECRET_BASIC',
  scopes: ['openid', 'profile', 'email']
};

/* the client registeted */
const client = {
  "clientId" : "7qLexw5y",
  "clientSecret" : "Nxztq23b",
  "clientName" : "tokyomap-app",
  "clientUri" : "https://localhost",
  "redirectUris" : [ "https://localhost/api/auth/callback" ],
  "logoUri" : null,
  "contacts" : null,
  "tosUri" : null,
  "policyUri" : null,
  "jwksUri" : null,
  "softwareId" : null,
  "softwareVersion" : null,
  "grantTypes" : [ "AUTHORISATION_CODE", "REFRESH_TOKEN" ],
  "responseTypes" : [ "CODE", "TOKEN" ],
  "tokenEndpointAuthMethod" : "CLIENT_SECRET_BASIC",
  "scopes" : [ "openid", "profile", "email" ],
  "registrationAccessToken" : "VOsrY2t1",
  "registrationClientUri" : "http://localhost:8080/api/v1/register/7qLexw5y",
};

module.exports = {
  postgres,
  auth,
  protectedResource,
  clientMetadata,
  client,
};
