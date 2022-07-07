FROM node:8-alpine as builder
WORKDIR /src
COPY package.json /src
RUN npm install
RUN npm rebuild node-sass
