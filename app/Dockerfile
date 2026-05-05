# multi stage build
## Build Stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

## Production Stage
FROM node:20-alpine
LABEL maintainer="xyzsince2014 <xyzsince2014@gmail.com>"
WORKDIR /app

## minimum requirements to execute app
COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist

EXPOSE 8080
ENV PORT=8080
CMD ["node", "./bin/www"]
