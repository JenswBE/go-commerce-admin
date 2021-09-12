import { GetterTree, ActionTree, MutationTree } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'
import { Alert, AlertType } from './general'
import { Product } from '../api/api'

export type ProductsMap = { [id: string]: Product }

export const state = () => ({
  products: {} as ProductsMap,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  productsList(state) {
    return Object.values(state.products)
  },
}

export const mutations: MutationTree<RootState> = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },

  ADD_PRODUCT(state, product) {
    Vue.set(state.products, product.id, cloneDeep(product))
  },

  UPDATE_PRODUCT(state, product) {
    Vue.set(state.products, product.id, cloneDeep(product))
  },

  DELETE_PRODUCT(state, product_id) {
    Vue.delete(state.products, product_id)
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async list(context) {
    console.debug('Store products/list', 'Dispatched')
    this.$api.products
      .adminListProducts()
      .then(({ data }) => {
        const products = data.products.reduce((result, item) => {
          result[item.id as string] = item
          return result
        }, {} as ProductsMap)
        context.commit('SET_PRODUCTS', products)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Producten ophalen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async add(context, product) {
    console.debug('Store products/add', 'Dispatched', product)
    if (product.manufacturer_id === '') {
      delete product.manufacturer_id
    }
    this.$api.products
      .adminAddProduct(product)
      .then(({ data }) => {
        context.commit('ADD_PRODUCT', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Product toevoegen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async update(context, product) {
    console.debug('Store products/update', 'Dispatched', product)
    if (product.manufacturer_id === '') {
      delete product.manufacturer_id
    }
    this.$api.products
      .adminUpdateProduct(product.id, product)
      .then(({ data }) => {
        context.commit('UPDATE_PRODUCT', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Product bijwerken mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async delete(context, product_id) {
    console.debug('Store products/delete', 'Dispatched', product_id)
    this.$api.products
      .adminDeleteProduct(product_id)
      .then(({ data }) => {
        context.commit('DELETE_PRODUCT', product_id)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Product verwijderen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },
}
