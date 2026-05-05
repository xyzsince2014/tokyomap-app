# tokyomap-bff

<img alt="GitHub top language" src="https://img.shields.io/github/languages/top/xyzsince2014/tokyomap-bff">
<img alt="GitHub tag (latest by date)" src="https://img.shields.io/github/v/tag/xyzsince2014/tokyomap-bff">

Backend resources for https://tokyomap.live

## How to dev
```bash
# update dev.env by the returned values of
./register_app_dev.sh

# build docker image and run
yarn install
./docker-build.sh
./docker-run.sh
```

## For production
```bash
# update the CodeBuild variables beforehand by the returned values of
./register_app.sh
```
