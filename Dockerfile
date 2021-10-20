FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .
RUN yarn
RUN yarn build

EXPOSE 8080
CMD [ "yarn", "start", "--hostname", "0.0.0.0", "--port", "8080" ]