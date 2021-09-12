import { GetterTree, ActionTree, MutationTree } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'
import { Alert, AlertType } from './general'
import { Category } from '../api/api'

const ImageConfigs = ['100']

export type CategoriesMap = { [id: string]: Category }

export const state = () => ({
  categories: {} as CategoriesMap,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  categoriesList(state) {
    return Object.values(state.categories)
  },

  sortedCategoriesList(state) {
    return Object.values(state.categories).sort((a, b) => a.order - b.order)
  },
}

export const mutations: MutationTree<RootState> = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },

  ADD_CATEGORY(state, category) {
    Vue.set(state.categories, category.id, cloneDeep(category))
  },

  UPDATE_CATEGORY(state, category) {
    Vue.set(state.categories, category.id, cloneDeep(category))
  },

  DELETE_CATEGORY(state, category_id) {
    Vue.delete(state.categories, category_id)
  },

  SET_CATEGORY_IMAGE_URLS(state, req) {
    let category = state.categories[req.category_id]
    category.image_urls = req.urls
    Vue.set(state.categories, req.category_id, cloneDeep(category))
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async list(context) {
    console.debug('Store categories/list', 'Dispatched')
    this.$api.categories
      .adminListCategories(ImageConfigs)
      .then(({ data }) => {
        const categories = data.categories.reduce((result, item) => {
          result[item.id as string] = item
          return result
        }, {} as CategoriesMap)
        context.commit('SET_CATEGORIES', categories)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Categorien ophalen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async add(context, category) {
    console.debug('Store categories/add', 'Dispatched', category)
    this.$api.categories
      .adminAddCategory(category)
      .then(({ data }) => {
        context.commit('ADD_CATEGORY', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Categorie toevoegen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async update(context, category) {
    console.debug('Store categories/update', 'Dispatched', category)
    this.$api.categories
      .adminUpdateCategory(category.id, category)
      .then(({ data }) => {
        context.commit('UPDATE_CATEGORY', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Categorie bijwerken mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async delete(context, category_id) {
    console.debug('Store categories/delete', 'Dispatched', category_id)
    this.$api.categories
      .adminDeleteCategory(category_id)
      .then(() => {
        context.commit('DELETE_CATEGORY', category_id)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Categorie verwijderen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async upsertImage(context, req) {
    console.debug('Store categories/upsertImage', 'Dispatched')

    // Check if valid image
    if (!req.image.type.includes('image/')) {
      const alert: Alert = {
        type: AlertType.Error,
        message: this.$i18n.t('uploadImage.notAnImage').toString(),
      }
      context.commit('general/SET_ALERT', alert, { root: true })
      return
    }

    this.$api.categories
      .adminUpsertCategoryImage(req.category_id, ImageConfigs, req.image)
      .then(({ data }) => {
        context.commit('SET_CATEGORY_IMAGE_URLS', {
          category_id: req.category_id,
          urls: data.urls,
        })
        return data
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
}
