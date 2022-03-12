# Based on https://github.com/nuxt/nuxt.js/blob/dev/examples/docker-build/Dockerfile

ARG NODE_IMAGE=node:lts-alpine

# Setup builder
FROM ${NODE_IMAGE} as builder
WORKDIR /src
COPY . .

# Build application
RUN yarn install --immutable
RUN yarn build

# Only install Production dependencies
RUN rm -rf node_modules
RUN NODE_ENV=production yarn workspaces focus --all --production
RUN yarn cache clean --all

# Build final image
FROM ${NODE_IMAGE}
WORKDIR /src
COPY --from=builder /src  .
EXPOSE 8080
CMD [ "yarn", "start", "--hostname", "0.0.0.0", "--port", "8080" ]
