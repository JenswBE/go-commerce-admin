[![GitHub](https://img.shields.io/github/license/JenswBE/go-commerce)](https://github.com/JenswBE/go-commerce-admin)
[![Docker Pulls](https://img.shields.io/docker/pulls/jenswbe/go-commerce)](https://hub.docker.com/r/jenswbe/go-commerce-admin)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=JenswBE_go-commerce-admin&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=JenswBE_go-commerce)

# GoCommerce - Admin

Admin site for [go-commerce](https://github.com/JenswBE/go-commerce)

## Links

- GitHub: https://github.com/JenswBE/go-commerce-admin
- DockerHub: https://hub.docker.com/r/jenswbe/go-commerce-admin
- Backend: https://github.com/JenswBE/go-commerce

## Configuration

- `AUTH_CLIENT_ID`: Client ID for OIDC
- `AUTH_STATE`: Set to unique and random value. Used to prevent CSRF attacks.
- `AUTH_URL_OIDC_CONFIG`: URL for OIDC configuration (ending on `.well-known/openid-configuration`)
- `AUTH_URL_LOGOUT_REDIRECT`: URL to redirect to after OIDC Logout. URL must be absolute.
- `BACKEND_URL_INTERNAL`: URL for the backend when rendering with SSR. Usually uses name of docker container.
- `BACKEND_URL_EXTERNAL`: URL for the backend for the browser. This is the domain name the backend is publicly reachable on.
- `PRODUCT_URL_TEMPLATE`: URL template pointing to the public page of a product. Product is available as variable `p`. E.g. `/products/${p.id}`.

## Local development

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev
```

## Thanks to

- Custom logic for upload button: https://codepen.io/blachocolat/pen/BgMKRQ
