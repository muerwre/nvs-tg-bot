FROM node:10.13

WORKDIR /usr/src/app
COPY ./package.json .
COPY ./yarn.lock .
RUN yarn
COPY . .
RUN yarn build

WORKDIR /usr/src/app/dist
COPY ./wait-for-it.sh .

EXPOSE 3002
CMD ["node", "./bin/server.js"]
