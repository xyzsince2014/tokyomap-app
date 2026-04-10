#!/bin/bash

# todo: make admin page to replace curl

# register the application via the auth server's client registation endpoint (dev)
# update dev.env by the returned values before build
# cf. RFC 7591
curl -k -i -X POST 'https://as.localhost/api/v1/register' \
  -u admin:password \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "client_name=tokyomap-app" \
  --data-urlencode "client_uri=http://localhost:3000" \
  --data-urlencode "scope=openid profile email" \
  --data-urlencode "redirect_uris=http://localhost:3000/api/auth/callback" \
  --data-urlencode "response_types=code" \
  --data-urlencode "grant_types=authorization_code refresh_token" \
  --data-urlencode "token_endpoint_auth_method=client_secret_basic"
