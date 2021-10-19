import { Oauth2Scheme } from '~auth/runtime'

// Based on:
// - Custom logout redirect param: https://github.com/cs8898/nuxt-auth-auth2-keycloak-sample
// - PublicRuntimeConfig support: https://github.com/nuxt-community/auth-module/issues/713#issuecomment-800974833

export default class KeycloakScheme extends Oauth2Scheme {
  constructor($auth, options) {
    const configOptions = {
      ...options,
      ...$auth.ctx.$config.auth.strategies[options.name],
    }
    super($auth, configOptions)
  }

  logout() {
    if (this.options.endpoints.logout) {
      const opts = {
        client_id: this.options.clientId,
        post_logout_redirect_uri: this.logoutRedirectURI,
        redirect_uri: this.logoutRedirectURI,
        logout_uri: this.logoutRedirectURI,
      }
      const url = this.options.endpoints.logout + '?' + encodeQuery(opts)
      window.location.replace(url)
    }
    return this.$auth.reset()
  }
}

// Copied from @nuxtjs/auth-next source
// See https://github.com/nuxt-community/auth-module
function encodeQuery(queryObject) {
  return Object.entries(queryObject)
    .filter(([_key, value]) => typeof value !== 'undefined')
    .map(
      ([key, value]) =>
        encodeURIComponent(key) +
        (value != null ? '=' + encodeURIComponent(value) : '')
    )
    .join('&')
}
