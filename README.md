[![GitHub](https://img.shields.io/github/license/JenswBE/go-commerce)](https://github.com/JenswBE/go-commerce-admin)
[![Docker Pulls](https://img.shields.io/docker/pulls/jenswbe/go-commerce)](https://hub.docker.com/r/jenswbe/go-commerce-admin)

# GoCommerce - Admin

Admin site for [go-commerce](https://github.com/JenswBE/go-commerce)

## Links

- GitHub: https://github.com/JenswBE/go-commerce-admin
- DockerHub: https://hub.docker.com/r/jenswbe/go-commerce-admin
- Backend: https://github.com/JenswBE/go-commerce

## Configuration

- `AUTH_CLIENT_ID`: Client ID for OAuth2
- `AUTH_STATE`: Set to unique and random value. Used to prevent CSRF attacks.
- `AUTH_URL_AUTHORIZATION`: URL for OAuth2 Authorization
- `AUTH_URL_TOKEN`: URL for OAuth2 Token
- `AUTH_URL_USERINFO`: URL for OAuth2 User info
- `AUTH_URL_LOGOUT`: URL for OAuth2 Logout
- `AUTH_URL_LOGOUT_REDIRECT`: URL to redirect to after OAuth2 Logout. URL must be absolute.
- `BACKEND_URL_INTERNAL`: URL for the backend when rendering with SSR. Usually uses name of docker container.
- `BACKEND_URL_EXTERNAL`: URL for the backend for the browser. This is the domain name the backend is publicly reachable on.
- `PRODUCT_URL_TEMPLATE`: URL template pointing to the public page of a product. Product is available as variable `p`. E.g. `/products/${p.id}`.

## Build

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# generate static project
$ yarn generate
```

## Thanks to

- Custom logic for upload button: https://codepen.io/blachocolat/pen/BgMKRQ
