import { Plugin } from '@nuxt/types'
import {
    CategoriesApi, CategoriesApiFactory,
    ManufacturersApi, ManufacturersApiFactory,
    ProductsApi, ProductsApiFactory
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
    categories: CategoriesApi
    manufacturers: ManufacturersApi
    products: ProductsApi
}

const api: Plugin = (context, inject) => {
    const api: Api = {
        categories: CategoriesApiFactory(undefined, undefined, context.$axios) as CategoriesApi,
        manufacturers: ManufacturersApiFactory(undefined, undefined, context.$axios) as ManufacturersApi,
        products: ProductsApiFactory(undefined, undefined, context.$axios) as ProductsApi,
    }

    inject('api', api)
}

export default api