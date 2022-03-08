import { Plugin } from '@nuxt/types'
import Axios from 'axios'
import {
  // Config
  ConfigApi,
  ConfigApiFactory,

  // Product
  CategoriesApi,
  CategoriesApiFactory,
  ManufacturersApi,
  ManufacturersApiFactory,
  ProductsApi,
  ProductsApiFactory,

  // Content
  ContentApi,
  ContentApiFactory,
  EventsApi,
  EventsApiFactory,
} from '../api/api'

declare module 'vue/types/vue' {
  // this.$api inside Vue components
  interface Vue {
    $api: Api
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$api inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $api: Api
  }
  // nuxtContext.$api
  interface Context {
    $api: Api
  }
}

declare module 'vuex/types/index' {
  // this.$api inside Vuex stores
  interface Store<S> {
    $api: Api
  }
}

interface Api {
  // Config
  config: ConfigApi

  // Product
  categories: CategoriesApi
  manufacturers: ManufacturersApi
  products: ProductsApi

  // Content
  content: ContentApi
  events: EventsApi
}

const api: Plugin = (context, inject) => {
  const configAxios = context.$axios.create()
  const api: Api = {
    // Config
    config: ConfigApiFactory(
      undefined,
      context.$axios.defaults.baseURL,
      configAxios
    ) as ConfigApi,

    // Product
    categories: CategoriesApiFactory(
      undefined,
      context.$axios.defaults.baseURL,
      context.$axios
    ) as CategoriesApi,
    manufacturers: ManufacturersApiFactory(
      undefined,
      context.$axios.defaults.baseURL,
      context.$axios
    ) as ManufacturersApi,
    products: ProductsApiFactory(
      undefined,
      context.$axios.defaults.baseURL,
      context.$axios
    ) as ProductsApi,

    // Content
    content: ContentApiFactory(
      undefined,
      context.$axios.defaults.baseURL,
      context.$axios
    ) as ContentApi,
    events: EventsApiFactory(
      undefined,
      context.$axios.defaults.baseURL,
      context.$axios
    ) as EventsApi,
  }

  inject('api', api)
}

export default api
