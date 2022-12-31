FROM node:14 AS BUILDER

WORKDIR /app

ADD package.json package-lock.json ./

RUN npm install

ADD .browserslistrc .prettierrc .eslintrc.js babel.config.js vue.config.js .env.production ./

COPY src ./src
COPY public ./public

RUN npm run build

FROM node:alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=BUILDER /app/dist ./

CMD serve -s -l $PORT
