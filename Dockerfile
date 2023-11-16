FROM golang:1.21.4-alpine3.18 AS gobuilder

RUN mkdir /hnh-map
WORKDIR /hnh-map

COPY go.mod go.sum ./
RUN go version
RUN go mod download

COPY . .
RUN go build -o hnh-map.go

FROM alpine:3.18.4 AS frontendbuilder

RUN mkdir /frontend
WORKDIR /frontend

RUN apk add --no-cache npm

COPY frontend/package.json .
RUN npm install --legacy-peer-deps

COPY frontend/ ./
RUN npm run build-new --omit=dev

FROM alpine:3.18.4

RUN mkdir /hnh-map
WORKDIR /hnh-map

COPY --from=gobuilder /hnh-map/hnh-map.go ./
COPY --from=frontendbuilder /frontend/dist ./frontend
COPY templates ./templates
COPY public ./public

EXPOSE 8080
CMD /hnh-map/hnh-map.go -grids=/map