import { Plugin } from '@nuxt/types'

const axiosPlugin: Plugin = (context) => {
  context.$axios.onRequest((config) => {
    // Based on https://github.com/axios/axios/issues/757#issuecomment-291016487
    if (config.url !== undefined && config.url[config.url.length - 1] !== '/') {
      config.url += '/'
    }
    return config
  })
}

export default axiosPlugin
