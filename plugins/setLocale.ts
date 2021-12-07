import { Plugin } from '@nuxt/types'
import { LocaleObject } from '@nuxtjs/i18n'
import jwt_decode from 'jwt-decode'

const setLocale: Plugin = (context, inject) => {
  // Get token
  const token: string = (context.$auth.strategy as any).token.get()
  if (!token) {
    return
  }

  // Extract locale
  const claims = jwt_decode(token)
  if (!claims || !(claims as any).locale) {
    return
  }
  const locale = (claims as any).locale
  const localeCodes = (context.i18n.locales as LocaleObject[]).map(
    (l) => l.code
  )

  // Set locale if not aligned
  if (!localeCodes.includes(locale)) {
    console.log(`Unknown locale "${locale}", supported locales: ${localeCodes}`)
    return
  }
  if (context.i18n.locale !== locale) {
    console.log(`Locale enforced from "${context.i18n.locale}" to "${locale}"`)
    context.i18n.setLocale(locale)
  }
}

export default setLocale
