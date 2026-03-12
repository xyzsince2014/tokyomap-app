#!/bin/bash
docker container run -d --rm \
  --env-file $(pwd)/app/dev.env \
  --name tokyomap-app \
  --net network_tokyomap \
  --ip 172.20.0.100 \
  tokyomap.app:dev 
