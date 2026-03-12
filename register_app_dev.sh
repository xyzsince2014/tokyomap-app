#!/bin/bash

# todo: make admin page to replace curl

# register the application via the auth server's client registation endpoint (dev)
# update dev.env by the returned values before build
curl -k -i -X POST 'https://localhost/auth/api/v1/register' \
  -u admin:password \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "client": {
      "clientName":"tokyomap-app",
      "clientUri":"https://localhost",
      "redirectUris":["https://localhost/api/auth/callback"],
      "responseTypes":["code"],
      "grantTypes":["authorization_code","refresh_token"],
      "tokenEndpointAuthMethod":"client_secret_basic",
      "scopes":["openid","profile","email"]
    }
  }'
