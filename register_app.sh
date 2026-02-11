#!/bin/bash

# todo: make admin page to replace curl

# register the application via the auth server's client registation endpoint (prod)
# update the CodeBuild variables by the returned values before build
curl -k -i -X POST 'https://tokyomap.live/auth/api/v1/register' \
  -u admin:password \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "client": {
      "clientName":"tokyomap-app",
      "clientUri":"https://tokyomap.live/",
      "redirectUris":["https://tokyomap.live/api/auth/callback"],
      "grantTypes":["AUTHORISATION_CODE","REFRESH_TOKEN"],
      "responseTypes":["CODE","TOKEN"],
      "tokenEndpointAuthMethod":"CLIENT_SECRET_BASIC",
      "scopes":["openid","profile","email"]
    }
  }'
