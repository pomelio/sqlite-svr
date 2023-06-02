

FROM node:16-alpine
RUN mkdir -p /app
RUN mkdir -p /db

COPY ./package.json .
RUN npm install
WORKDIR /app
EXPOSE 3000
CMD [ "node", "server.js" ]