FROM node:latest

LABEL org.opencontainers.image.authors="623337308@qq.com/monitor-serve"

COPY . /monitor-serve
WORKDIR /monitor-serve
# RUN npm i
# RUN tsc -w
# RUN node dist/index.js

EXPOSE 4000
