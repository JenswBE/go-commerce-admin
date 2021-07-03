import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'

export const state = () => ({
  categories: {},
})

export const getters = {
  categoriesList(state) {
    return Object.values(state.categories)
  },

  sortedCategoriesList(state) {
    return Object.values(state.categories).sort((a, b) => a.order - b.order)
  },
}

export const mutations = {
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
}

export const actions = {
  async list(context) {
    console.debug('Store categories/list', 'Dispatched')
    this.$axios
      .get(`/categories`)
      .then(({ data }) => {
        const categories = data.reduce((result, item) => {
          result[item.id] = item
          return result
        }, {})
        context.commit('SET_CATEGORIES', categories)
      })
      .catch((e) => {
        const msg = `Merken ophalen mislukt: ${e.message}`
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        )
      })
  },

  async add(context, category) {
    console.debug('Store categories/add', 'Dispatched', category)
    this.$axios
      .post(`/categories`, category)
      .then(({ data }) => {
        context.commit('ADD_CATEGORY', data)
      })
      .catch((e) => {
        const msg = `Merk toevoegen mislukt: ${e.message}`
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        )
      })
  },

  async update(context, category) {
    console.debug('Store categories/update', 'Dispatched', category)
    this.$axios
      .put(`/categories/${category.id}`, category)
      .then(({ data }) => {
        context.commit('UPDATE_CATEGORY', data)
      })
      .catch((e) => {
        const msg = `Merk bijwerken mislukt: ${e.message}`
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        )
      })
  },

  async delete(context, category_id) {
    console.debug('Store categories/delete', 'Dispatched', category_id)
    this.$axios
      .delete(`/categories/${category_id}`)
      .then(({ data }) => {
        context.commit('DELETE_CATEGORY', category_id)
      })
      .catch((e) => {
        const msg = `Merk verwijderen mislukt: ${e.message}`
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        )
      })
  },
}
