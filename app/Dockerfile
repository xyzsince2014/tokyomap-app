FROM node:16

LABEL maintainer="xyzsince2014 <xyzsince2014@gmail.com>"

WORKDIR /src

# Copy only dependency files first and install them (to leverage caching)
COPY package.json package-lock.json ./
RUN npm install --production

# copy the codebase
COPY . .

EXPOSE 8080

ENTRYPOINT [ "npm", "run", "start:prod" ]
