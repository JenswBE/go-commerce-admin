import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'

const ImageConfigs = ['100']

export const state = () => ({
  manufacturers: {},
})

export const getters = {
  manufacturersList(state) {
    return Object.values(state.manufacturers)
  },
}

export const mutations = {
  SET_MANUFACTURERS(state, manufacturers) {
    state.manufacturers = manufacturers
  },

  ADD_MANUFACTURER(state, manufacturer) {
    Vue.set(state.manufacturers, manufacturer.id, cloneDeep(manufacturer))
  },

  UPDATE_MANUFACTURER(state, manufacturer) {
    Vue.set(state.manufacturers, manufacturer.id, cloneDeep(manufacturer))
  },

  DELETE_MANUFACTURER(state, manufacturer_id) {
    Vue.delete(state.manufacturers, manufacturer_id)
  },

  SET_MANUFACTURER_IMAGE_URLS(state, req) {
    let manufacturer = state.manufacturers[req.manufacturer_id]
    manufacturer.image_urls = req.urls
    Vue.set(state.manufacturers, req.manufacturer_id, cloneDeep(manufacturer))
  },
}

export const actions = {
  async list(context) {
    console.debug('Store manufacturers/list', 'Dispatched')
    this.$api.manufacturers
      .adminListManufacturers(ImageConfigs)
      .then(({ data }) => {
        const manufacturers = data.manufacturers.reduce((result, item) => {
          result[item.id] = item
          return result
        }, {})
        context.commit('SET_MANUFACTURERS', manufacturers)
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

  async add(context, manufacturer) {
    console.debug('Store manufacturers/add', 'Dispatched', manufacturer)
    this.$api.manufacturers
      .adminAddManufacturer(manufacturer)
      .then(({ data }) => {
        context.commit('ADD_MANUFACTURER', data)
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

  async update(context, manufacturer) {
    console.debug('Store manufacturers/update', 'Dispatched', manufacturer)
    this.$api.manufacturers
      .adminUpdateManufacturer(manufacturer.id, manufacturer)
      .then(({ data }) => {
        context.commit('UPDATE_MANUFACTURER', data)
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

  async delete(context, manufacturer_id) {
    console.debug('Store manufacturers/delete', 'Dispatched', manufacturer_id)
    this.$api.manufacturers
      .adminDeleteManufacturer(manufacturer_id)
      .then(() => {
        context.commit('DELETE_MANUFACTURER', manufacturer_id)
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

  async upsertImage(context, req) {
    console.debug('Store manufacturers/upsertImage', 'Dispatched')

    // Check if valid image
    if (!req.image.type.includes('image/')) {
      context.commit(
        'general/SET_ALERT',
        {
          type: 'error',
          message: context.$t('uploadImage.notAnImage'),
        },
        { root: true }
      )
      return
    }

    this.$api.manufacturers
      .adminUpsertManufacturerImage(
        req.manufacturer_id,
        ImageConfigs,
        req.image
      )
      .then(({ data }) => {
        context.commit('SET_MANUFACTURER_IMAGE_URLS', {
          manufacturer_id: req.manufacturer_id,
          urls: data.urls,
        })
        return data
      })
      .catch((e) => {
        const msg = context.$t('uploadImage.uploadFailed', {
          error: e.response.data,
        })
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        )
      })
  },
}
