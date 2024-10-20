FROM node:20.18.0-bookworm-slim
WORKDIR /usr/src/symbol-lite-api
COPY package.json /usr/src/symbol-lite-api/
COPY dist/ /usr/src/symbol-lite-api/dist/
COPY node_modules/ /usr/src/symbol-lite-api/node_modules/
CMD [ "node", "dist/index.js" ]
