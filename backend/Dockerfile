FROM node:14-alpine

WORKDIR /app

ADD package.json package-lock.json ./

RUN npm install

ADD bin ./bin
ADD src ./src

CMD [ "npm", "start" ]
