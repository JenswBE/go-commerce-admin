import { GetterTree, ActionTree, MutationTree } from 'vuex'
import cloneDeep from 'lodash.clonedeep'
import Vue from 'vue'
import { Alert, AlertType } from './general'
import { Content } from '../api/api'

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
  SET_CONTENT(state, content: ContentMap) {
    state.content = content
  },

  UPDATE_CONTENT(state, content: Content) {
    Vue.set(state.content, content.name, cloneDeep(content))
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async list(context) {
    console.debug('Store content/list', 'Dispatched')
    return this.$api.content
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
    return this.$api.content
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
