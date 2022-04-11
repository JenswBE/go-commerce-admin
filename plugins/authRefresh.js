import { RefreshScheme } from '~auth/runtime'

// Based on PublicRuntimeConfig support: https://github.com/nuxt-community/auth-module/issues/713#issuecomment-800974833

export default class PublicConfigRefreshScheme extends RefreshScheme {
  constructor($auth, options) {
    const configOptions = {
      ...options,
      ...$auth.ctx.$config.auth.strategies[options.name],
    }
    super($auth, configOptions)
  }
}
