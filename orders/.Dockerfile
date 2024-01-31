FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /home/node/app

COPY . .

RUN npm i && npm run build

EXPOSE 3000
CMD [  "bash", "-c", "npm run start" ]