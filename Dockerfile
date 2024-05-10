FROM node:20.13.0-alpine

WORKDIR /usr/src/app

COPY ./package*.json /usr/src/app/

RUN npm ci --only=production && npm cache clean --force

COPY . /usr/src/app/

EXPOSE 4000
