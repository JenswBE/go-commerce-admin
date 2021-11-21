import { GetterTree, ActionTree, MutationTree } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'
import { Alert, AlertType } from './general'
import { Content } from '../api/api'

const ImageConfigs = ['100']

export type ContentMap = { [id: string]: Content }

export const state = () => ({
  content: {} as ContentMap,
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  contentList(state) {
    return Object.values(state.content)
  },
}

export const mutations: MutationTree<RootState> = {
  SET_CONTENT(state, content) {
    state.content = content
  },

  UPDATE_CONTENT(state, content) {
    Vue.set(state.content, content.name, cloneDeep(content))
  },
}

export type UpsertImageReq = {
  content_id: string
  image: File
}

export const actions: ActionTree<RootState, RootState> = {
  async list(context) {
    console.debug('Store content/list', 'Dispatched')
    this.$api.content
      .listContent()
      .then(({ data }) => {
        const content = data.content.reduce((result, item) => {
          result[item.name] = item
          return result
        }, {} as ContentMap)
        context.commit('SET_CONTENT', content)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message:
            this.$i18n
              .t('fetchItemFailed', { item: this.$i18n.tc('content', 1) })
              .toString() + `: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },

  async update(context, content: Content) {
    console.debug('Store content/update', 'Dispatched', content)
    this.$api.content
      .updateContent(content.name, content)
      .then(({ data }) => {
        context.commit('UPDATE_CONTENT', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message:
            this.$i18n
              .t('updateItemFailed', { item: this.$i18n.tc('content', 1) })
              .toString() + `: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },
}
