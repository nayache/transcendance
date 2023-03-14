FROM node:latest

RUN apt-get update

WORKDIR /app

EXPOSE 3042

ENTRYPOINT [ "/bin/sh", "-c", "npm install && npm run start:dev" ]
