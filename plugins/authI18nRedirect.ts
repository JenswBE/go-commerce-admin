// Based on https://github.com/nuxt-community/auth-module/pull/185

import { Plugin } from '@nuxt/types'
import qs from 'qs'

const authI18nRedirect: Plugin = (context, _) => {
  context.$auth.onRedirect((to) => {
    return context.localePath(to)
  })

  context.$axios.interceptors.request.use((req) => {
    console.log('data: ', req.data)
    req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    req.data = qs.stringify(req.data)
    console.log('stringified data', req.data)
    return req
  })
}

export default authI18nRedirect
