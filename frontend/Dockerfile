FROM alpine:3.15.10 AS frontendbuilder

RUN mkdir /frontend
WORKDIR /frontend

RUN apk add --no-cache npm

COPY package.json .
RUN npm install

COPY ./ ./

RUN npm run build