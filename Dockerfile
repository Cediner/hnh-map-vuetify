FROM golang:1.21.3 AS gobuilder

RUN mkdir /hnh-map
WORKDIR /hnh-map

COPY go.mod go.sum ./
RUN go version
RUN go mod download

COPY . .
RUN go build -o hnh-map.go

FROM alpine:3.15.10 AS frontendbuilder

RUN mkdir /frontend
WORKDIR /frontend

RUN apk add --no-cache npm

COPY frontend/package.json .
RUN npm install

COPY frontend/ ./
RUN npm run build

FROM golang:1.21.3

RUN mkdir /hnh-map
WORKDIR /hnh-map

COPY --from=gobuilder /hnh-map/hnh-map.go ./
COPY --from=frontendbuilder /frontend/dist ./frontend
COPY templates ./templates
COPY public ./public

EXPOSE 8080
CMD /hnh-map/hnh-map.go -grids=/map