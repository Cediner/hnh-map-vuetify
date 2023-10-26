FROM alpine:3.18.4 AS frontendbuilder

RUN mkdir /frontend
WORKDIR /frontend

RUN apk add --no-cache npm

COPY package.json .
RUN npm install node@16.0.0 --save-dev
RUN npm audit fix --force

COPY ./ ./

RUN npm run build