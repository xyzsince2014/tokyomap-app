# tokyomap-app

<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/xyzsince2014/tokyomap-app">
<img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/xyzsince2014/tokyomap-app">

Backend resources for https://tokyomap.live

## How to dev
```bash
# Before build, update dev.env by the return of
curl -k -i -X POST -d '{"client": {"clientName":"tokyomap-app","clientUri":"https://localhost","redirectUris":["https://localhost/api/auth/callback"],"grantTypes":["authorization_code","refresh_token"],"responseTypes":["CODE","TOKEN"],"tokenEndpointAuthMethod":"client_secret_basic","scope":["openid","profile","email"]}}' -H "Content-Type: application/json" -H "Accept: application/json" 'https://localhost/auth/api/v1/register'

# put .credentials.dev.env in /app beforehand
yarn install
./docker-build.sh
./docker-run.sh
```
## For production
```bash
# Before build, register the client by
curl -X POST -d '{"client": {"clientName":"tokyomap-app","clientUri":"https://tokyomap.live/","redirectUris":["https://tokyomap.live/api/auth/callback"],"grantTypes":["authorization_code","refresh_token"],"responseTypes":["CODE","TOKEN"],"tokenEndpointAuthMethod":"client_secret_basic","scope":["openid","profile","email"]}}' -H "Content-Type: application/json" -H "Accept: application/json" 'https://tokyomap.live/auth/api/v1/register'
```
