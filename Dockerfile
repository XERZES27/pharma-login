FROM node:14.13.0-alpine

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

COPY package-lock.json ./

RUN npm ci install

COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "http-server", "dist" ]