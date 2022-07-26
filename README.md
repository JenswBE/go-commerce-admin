# :warning: This frontend is no longer maintained. Instead the build-in [admin client of GoCommerce](https://github.com/JenswBE/go-commerce) should be used directly.

[![GitHub](https://img.shields.io/github/license/JenswBE/go-commerce-admin)](https://github.com/JenswBE/go-commerce-admin)
[![Docker Pulls](https://img.shields.io/docker/pulls/jenswbe/go-commerce-admin)](https://hub.docker.com/r/jenswbe/go-commerce-admin)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=JenswBE_go-commerce-admin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=JenswBE_go-commerce-admin)

# GoCommerce - Admin

Admin site for [go-commerce](https://github.com/JenswBE/go-commerce)

## Links

- GitHub: https://github.com/JenswBE/go-commerce-admin
- DockerHub: https://hub.docker.com/r/jenswbe/go-commerce-admin
- Backend: https://github.com/JenswBE/go-commerce

## Configuration

- `AUTH_CLIENT_ID`: Client ID for OIDC and password login
- `AUTH_STATE`: Set to unique and random value. Used to prevent CSRF attacks.
- `AUTH_URL_OIDC_CONFIG`: URL for OIDC configuration (ending on `.well-known/openid-configuration`)
- `AUTH_URL_LOGOUT_REDIRECT`: URL to redirect to after OIDC Logout. URL must be absolute.
- `AUTH_PASSWORD_URL_LOGIN`: AppleWebkit doesn't like the SSO. As a workaround, I implemented the OIDC "password" grant as well. URL to the token endpoint.
- `AUTH_PASSWORD_URL_REFRESH`: URL to the refresh endpoint for "password" grant.
- `AUTH_PASSWORD_LOGOUT`: URL to the logout endpoint for "password" grant.
- `BACKEND_URL_INTERNAL`: URL for the backend when rendering with SSR. Usually uses name of docker container.
- `BACKEND_URL_EXTERNAL`: URL for the backend for the browser. This is the domain name the backend is publicly reachable on.
- `PRODUCT_URL_TEMPLATE`: URL template pointing to the public page of a product. Product is available as variable `p`. E.g. `/products/${p.id}`.

## Local development

```bash
# install dependencies
$ yarn install

# serve with hot reload at 127.0.0.1:3000
$ yarn dev
```

## Thanks to

- Custom logic for upload button: https://codepen.io/blachocolat/pen/BgMKRQ
