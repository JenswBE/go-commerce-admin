import { GetterTree, ActionTree, MutationTree } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'
import { Alert, AlertType } from './general'
import { Manufacturer } from '../api/api'

const ImageConfigs = ['100']

export type ManufacturersMap = { [id: string]: Manufacturer }

export const state = () => ({
  manufacturers: {} as ManufacturersMap,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  manufacturersList(state) {
    return Object.values(state.manufacturers)
  },
}

export const mutations: MutationTree<RootState> = {
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

export type UpsertImageReq = {
  manufacturer_id: string
  image: File
}

export const actions: ActionTree<RootState, RootState> = {
  async list(context) {
    console.debug('Store manufacturers/list', 'Dispatched')
    this.$api.manufacturers
      .listManufacturers(ImageConfigs)
      .then(({ data }) => {
        const manufacturers = data.manufacturers.reduce((result, item) => {
          result[item.id as string] = item
          return result
        }, {} as ManufacturersMap)
        context.commit('SET_MANUFACTURERS', manufacturers)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Merken ophalen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async add(context, manufacturer: Manufacturer) {
    console.debug('Store manufacturers/add', 'Dispatched', manufacturer)
    this.$api.manufacturers
      .addManufacturer(manufacturer)
      .then(({ data }) => {
        context.commit('ADD_MANUFACTURER', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Merk toevoegen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async update(context, manufacturer: Manufacturer) {
    console.debug('Store manufacturers/update', 'Dispatched', manufacturer)
    this.$api.manufacturers
      .updateManufacturer(manufacturer.id as string, manufacturer)
      .then(({ data }) => {
        context.commit('UPDATE_MANUFACTURER', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Merk bijwerken mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async delete(context, manufacturer_id: string) {
    console.debug('Store manufacturers/delete', 'Dispatched', manufacturer_id)
    this.$api.manufacturers
      .deleteManufacturer(manufacturer_id)
      .then(() => {
        context.commit('DELETE_MANUFACTURER', manufacturer_id)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message: `Merk verwijderen mislukt: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async upsertImage(context, req: UpsertImageReq) {
    console.debug('Store manufacturers/upsertImage', 'Dispatched')

    // Check if valid image
    if (!req.image.type.includes('image/')) {
      const alert: Alert = {
        type: AlertType.Error,
        message: this.$i18n.t('uploadImage.notAnImage').toString(),
      }
      context.commit('general/SET_ALERT', alert, { root: true })
      return
    }

    this.$api.manufacturers
      .upsertManufacturerImage(req.manufacturer_id, req.image, ImageConfigs)
      .then(({ data }) => {
        context.commit('SET_MANUFACTURER_IMAGE_URLS', {
          manufacturer_id: req.manufacturer_id,
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

  async deleteImage(context, manufacturer_id: string) {
    console.debug('Store manufacturers/deleteImage', 'Dispatched')
    this.$api.manufacturers
      .deleteManufacturerImage(manufacturer_id)
      .then(() => {
        context.commit('SET_MANUFACTURER_IMAGE_URLS', {
          manufacturer_id: manufacturer_id,
          urls: undefined,
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
