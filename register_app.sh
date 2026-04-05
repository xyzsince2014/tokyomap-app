#!/bin/bash

# todo: make admin page to replace curl
# register this RP via the client registation endpoint (prod) of the AS
# update the CodeBuild variables by the returned values before build
curl -k -i -X POST 'https://tokyomap.live/auth/api/v1/register' \
  -u <user>:<password> \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "client_name=tokyomap-app" \
  --data-urlencode "client_uri=https://tokyomap.live" \
  --data-urlencode "scope=openid profile email" \
  --data-urlencode "redirect_uris=https://tokyomap.live/api/auth/callback" \
  --data-urlencode "response_types=code" \
  --data-urlencode "grant_types=authorization_code refresh_token" \
  --data-urlencode "token_endpoint_auth_method=client_secret_basic"
