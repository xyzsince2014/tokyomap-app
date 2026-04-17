#!/bin/bash

# doker run for dev

# postgres
docker run -d --rm \
  --name tokyomap-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=tokyomap \
  -e TZ=Asia/Tokyo \
  -p 5433:5432 \
  -v $(pwd)/postgres/hgsql/data:/var/lib/hgsql/data \
  -v $(pwd)/postgres/initdb.d:/docker-entrypoint-initdb.d \
  -v $(pwd)/postgres/var/lib/postgresql/data:/var/lib/postgresql/data \
  -v $(pwd)/postgres/var/tmp:/var/tmp \
  postgres:14 -c timezone='Asia/Tokyo' -c log_timezone='Asia/Tokyo'

# redis
docker run -d --rm \
  --name tokyomap-redis \
  -p 6379:6379 \
  -v $(pwd)/redis/data:/data \
  redis:7-alpine
