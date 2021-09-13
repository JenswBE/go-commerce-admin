import { GetterTree, ActionTree, MutationTree } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'
import { Alert, AlertType } from './general'
import { Product } from '../api/api'

const ImageConfigs = ['100']

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
  SET_PRODUCTS(state, products: ProductsMap) {
    state.products = products
  },

  ADD_PRODUCT(state, product: Product) {
    Vue.set(state.products, product.id as string, cloneDeep(product))
  },

  UPDATE_PRODUCT(state, product: Product) {
    Vue.set(state.products, product.id as string, cloneDeep(product))
  },

  DELETE_PRODUCT(state, product_id: string) {
    Vue.delete(state.products, product_id)
  },

  SET_PRODUCT_IMAGE_URLS(state, req) {
    let product = state.products[req.product_id]
    product.image_urls = req.urls
    Vue.set(state.products, req.product_id, cloneDeep(product))
  },
}

export type AddImageReq = {
  product_id: string
  image: File
}

export type DeleteImageReq = {
  product_id: string
  image_id: string
}

export const actions: ActionTree<RootState, RootState> = {
  async list(context) {
    console.debug('Store products/list', 'Dispatched')
    this.$api.products
      .adminListProducts(ImageConfigs)
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

  async add(context, product: Product) {
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

  async update(context, product: Product) {
    console.debug('Store products/update', 'Dispatched', product)
    if (product.manufacturer_id === '') {
      delete product.manufacturer_id
    }
    this.$api.products
      .adminUpdateProduct(product.id as string, product)
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

  async delete(context, product_id: string) {
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

  async addImage(context, req: AddImageReq) {
    console.debug('Store products/addImage', 'Dispatched')

    // Check if valid image
    if (!req.image.type.includes('image/')) {
      const alert: Alert = {
        type: AlertType.Error,
        message: this.$i18n.t('uploadImage.notAnImage').toString(),
      }
      context.commit('general/SET_ALERT', alert, { root: true })
      return
    }

    // Call API
    return this.$api.products
      .adminAddProductImages(req.product_id, ImageConfigs, [req.image])
      .then(({ data }) => {
        const urls = data.images.map((img) => img.urls)
        context.commit('SET_PRODUCT_IMAGE_URLS', {
          product_id: req.product_id,
          urls: urls,
        })
        return data.images
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: this.$i18n
            .t('uploadImage.uploadFailed', { error: e.response.data })
            .toString(),
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async deleteImage(context, req: DeleteImageReq) {
    console.debug('Store products/deleteImage', 'Dispatched')

    // Call API
    this.$api.products
      .adminDeleteProductImage(req.product_id, req.image_id)
      .then(() => {
        // Refetch product
        this.$api.products
          .adminGetProduct(req.product_id, ImageConfigs)
          .then((product) => {
            context.commit('SET_PRODUCT_IMAGE_URLS', {
              product_id: req.product_id,
              urls: product.data.image_urls,
            })
          })
          .catch((e) => {
            const alert: Alert = {
              type: AlertType.Error,
              message: `Product ophalen mislukt: ${e.message}`,
            }
            context.commit('general/SET_ALERT', alert, { root: true })
          })
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: this.$i18n
            .t('uploadImage.deleteFailed', { error: e.response.data })
            .toString(),
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },
}
