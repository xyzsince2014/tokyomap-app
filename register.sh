#!/bin/bash

# todo: make an admin page to replace curl

# register the application via the auth server's client registation endpoint (dev)
# update dev.env by the returned values before build

DOMAIN="http://localhost:3000"
IDP_DOMAIN="https://tallyme-idp.localhost"

curl -k -i -X POST "$IDP_DOMAIN/api/v1/register" \
  -u admin:password \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "client_name=tokyomap-bff" \
  --data-urlencode "client_uri=$DOMAIN" \
  --data-urlencode "scope=openid profile email" \
  --data-urlencode "redirect_uris=$DOMAIN/api/auth/callback" \
  --data-urlencode "response_types=code" \
  --data-urlencode "grant_types=authorization_code refresh_token" \
  --data-urlencode "token_endpoint_auth_method=client_secret_basic"
