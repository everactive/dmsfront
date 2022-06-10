FROM node:8-alpine as builder
WORKDIR /src
RUN npm install
RUN npm rebuild node-sass
RUN npm run build
