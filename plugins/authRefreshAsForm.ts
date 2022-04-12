// Based on https://github.com/nuxt-community/auth-module/pull/185

import { Plugin } from '@nuxt/types'
import qs from 'qs'

const authRefreshAsForm: Plugin = (context, _) => {
  context.$axios.interceptors.request.use((req) => {
    req.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    req.data = qs.stringify(req.data)
    return req
  })
}

export default authRefreshAsForm
