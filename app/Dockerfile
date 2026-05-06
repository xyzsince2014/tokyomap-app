FROM node:20-alpine
LABEL maintainer="xyzsince2014 <xyzsince2014@gmail.com>"

WORKDIR /app

COPY package*.json ./
RUN npm install --production

EXPOSE 8080
ENV PORT=8080

CMD ["node", "./bin/www"]
