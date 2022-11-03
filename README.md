# tokyomap-app

<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/xyzsince2014/tokyomap-app">
<img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/xyzsince2014/tokyomap-app">

Backend resources for https://www.tokyomap.live

## How to dev
```bash
# Before build, update `client` in config.js by the return of
curl -X POST -d '{"client": {"clientName":"tokyomap-app","clientUri":"https://localhost","redirectUris":["https://localhost/api/auth/callback"],"grantTypes":["AUTHORISATION_CODE","REFRESH_TOKEN"],"responseTypes":["CODE","TOKEN"],"tokenEndpointAuthMethod":"CLIENT_SECRET_BASIC","scopes":["openid","profile","email"]}}' -H "Content-Type: application/json" -H "Accept: application/json" 'https://localhost/auth/api/v1/register'

# put .credentials.dev.env in /app beforehand
yarn install
./docker-build.sh
./docker-run.sh
```
## For production
```bash
# Before build, register the client by
curl -X POST -d '{"client": {"clientName":"tokyomap-app","clientUri":"https://www.tokyomap.live/","redirectUris":["https://www.tokyomap.live/api/auth/callback"],"grantTypes":["AUTHORISATION_CODE","REFRESH_TOKEN"],"responseTypes":["CODE","TOKEN"],"tokenEndpointAuthMethod":"CLIENT_SECRET_BASIC","scopes":["openid","profile","email"]}}' -H "Content-Type: application/json" -H "Accept: application/json" 'https://www.tokyomap.live//auth/api/v1/register'
```