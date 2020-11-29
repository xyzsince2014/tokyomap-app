FROM node:14.3

RUN mkdir /src
COPY . /src

ARG NODE_ENV
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD
ARG DB_DATABASE
ARG COOKIE_SECRET_KEY
ARG TWITTER_CONSUMER_KEY
ARG TWITTER_CONSUMER_SECRET
ARG FACEBOOK_APP_ID
ARG FACEBOOK_APP_SECRET
ARG LINE_CHANNEL_ID
ARG LINE_CHANNEL_SECRET
ARG DOMAIN_DEV
ARG DOMAIN_CLIENT

ENV NODE_ENV=${NODE_ENV}
ENV DB_HOST=${DB_HOST}
ENV DB_USER=${DB_USER}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}
ENV COOKIE_SECRET_KEY=${COOKIE_SECRET_KEY}
ENV TWITTER_CONSUMER_KEY=${TWITTER_CONSUMER_KEY}
ENV TWITTER_CONSUMER_SECRET=${TWITTER_CONSUMER_SECRET}
ENV FACEBOOK_APP_ID=${FACEBOOK_APP_ID}
ENV FACEBOOK_APP_SECRET=${FACEBOOK_APP_SECRET}
ENV LINE_CHANNEL_ID=${LINE_CHANNEL_ID}
ENV LINE_CHANNEL_SECRET=${LINE_CHANNEL_SECRET}
ENV DOMAIN_DEV=${DOMAIN_DEV}
ENV DOMAIN_CLIENT=${DOMAIN_CLIENT}

WORKDIR /src

RUN yarn install --production