// Based on https://github.com/nuxt-community/auth-module/pull/185

import { Plugin } from '@nuxt/types'

const authI18nRedirect: Plugin = (context, _) => {
  context.$auth.onRedirect((to) => {
    return context.localePath(to)
  })
}

export default authI18nRedirect
