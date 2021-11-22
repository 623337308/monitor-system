FROM node:latest

LABEL org.opencontainers.image.authors="623337308@qq.com/monitor-serve"

RUN mkdir -p /monitor-serve
WORKDIR /monitor-serve

COPY . /monitor-serve

RUN npm i pnpm -g
RUN npm i typescript -g
RUN pnpm i
RUN tsc --noEmit

ENTRYPOINT ["npm", "run"]
CMD ["start"]

EXPOSE 4000
