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

/**
 * register the client beforehand by
 * curl -X POST -d '{"client": {"clientName":"tokyomap-app","clientUri":"https://localhost","redirectUris":["https://localhost/api/auth/callback"],"grantTypes":["AUTHORISATION_CODE","REFRESH_TOKEN"],"responseTypes":["CODE","TOKEN"],"tokenEndpointAuthMethod":"CLIENT_SECRET_BASIC","scopes":["openid","profile","email"]}}' -H "Content-Type: application/json" -H "Accept: application/json" 'https://localhost/auth/api/v1/register'
 * 
 * use its response as client below
 */
const clientMetadata = {
  clientName: 'tokyomap-app',
  clientUri: `${process.env.DOMAIN}`,
  redirectUris: [`${process.env.DOMAIN}/api/auth/callback`],
  grantTypes: ['AUTHORISATION_CODE', 'REFRESH_TOKEN'],
  responseTypes: ['CODE', 'TOKEN'],
  tokenEndpointAuthMethod: 'CLIENT_SECRET_BASIC',
  scopes: ['openid', 'profile', 'email']
};

/* the client registeted */
const client = {
  "clientId" : "J8UPrig0",
  "clientSecret" : "CLCSZECs",
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
  "registrationAccessToken" : "dEhQSvqO",
  "registrationClientUri" : "http://localhost:8080/api/v1/register/J8UPrig0",
};

module.exports = {
  postgres,
  auth,
  protectedResource,
  clientMetadata,
  client,
};
