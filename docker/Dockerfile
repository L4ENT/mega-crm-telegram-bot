# Dockerfile

# base image
FROM node:16.17-alpine3.15

RUN apk add g++ make py3-pip

RUN apk add --no-cache \
    curl \
    build-base \
    libpng \
    libpng-dev \
    jpeg-dev \
    pango-dev \
    cairo-dev \
    giflib-dev \
    ;

#  add glibc and install canvas
RUN apk --no-cache add ca-certificates wget  && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
    apk add glibc-2.29-r0.apk \
    ;

# create & set working directory
RUN mkdir -p /var/www

WORKDIR /var/www

COPY package.json package-lock.json  ./

# install dependencies
RUN npm cache clean --force && npm install

COPY . .

RUN npm run build

# start app
EXPOSE 3000
