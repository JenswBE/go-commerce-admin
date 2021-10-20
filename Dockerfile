# Based on https://github.com/nuxt/nuxt.js/blob/dev/examples/docker-build/Dockerfile

# Setup builder
FROM node:lts-alpine as builder
WORKDIR /src
COPY . .

# Build application
RUN yarn install --immutable
RUN yarn build

# Only install Production dependencies
RUN rm -rf node_modules
RUN NODE_ENV=production yarn workspaces focus --all --production

# Build final image
FROM node:lts-alpine
WORKDIR /src
COPY --from=builder /src  .
EXPOSE 8080
CMD [ "yarn", "start", "--hostname", "0.0.0.0", "--port", "8080" ]
