# Build application
FROM node:lts-alpine as builder
WORKDIR /app
COPY . .
RUN yarn
RUN yarn generate

# Build final image
FROM nginx:stable-alpine
ARG SERVICE_NAME
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]