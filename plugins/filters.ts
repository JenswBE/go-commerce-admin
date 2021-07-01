import Vue from 'vue'

Vue.filter('formatPrice', formatPrice)

function formatPrice(price: string) {
  const priceInt = parseInt(price)
  const priceFloat = priceInt / 100.0
  return priceFloat.toLocaleString(undefined, {
    style: 'currency',
    currency: 'EUR',
  })
}
