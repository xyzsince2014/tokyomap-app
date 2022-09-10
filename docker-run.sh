#!/bin/bash
docker container run -d \
  --env-file $(pwd)/app/dev.env \
  --env-file $(pwd)/app/.credentials.dev.env \
  -p 80:80 \
  --rm \
  --name app \
  --net network_dev \
  --ip 192.168.56.100 \
  tokyomap.app:dev 
