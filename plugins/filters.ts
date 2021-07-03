import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $capitalize(price: string): string
    $formatPrice(price: string): string
  }
}

function capitalize(value: string): string {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}
Vue.filter('capitalize', capitalize)
Vue.prototype.$capitalize = capitalize

function formatPrice(price: string): string {
  const priceInt = parseInt(price)
  const priceFloat = priceInt / 100.0
  return priceFloat.toLocaleString(undefined, {
    style: 'currency',
    currency: 'EUR',
  })
}
Vue.filter('formatPrice', formatPrice)
Vue.prototype.$formatPrice = formatPrice
