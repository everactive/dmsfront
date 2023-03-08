FROM node:16-alpine as builder
WORKDIR /src
COPY package.json /src
RUN npm install
