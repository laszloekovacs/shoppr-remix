# build environment
FROM node:20-alpine as build

WORKDIR /build

COPY package*.json /build

RUN npm install

COPY . .

RUN npm run build

# production environment
FROM node:20-alpine as production

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY --from=build build/build /app/build
COPY public /app/public

EXPOSE 3000

CMD ["npm", "start"]
