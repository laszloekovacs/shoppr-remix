FROM node:20-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY ./ .

RUN npm run build

ENV MODE_ENV=production

EXPOSE 3000

CMD ["npm","run", "start"]
