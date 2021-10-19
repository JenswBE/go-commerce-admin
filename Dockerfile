FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .
RUN yarn
RUN yarn build

ENV PORT=8080
EXPOSE 8080
CMD [ "yarn", "start" ]