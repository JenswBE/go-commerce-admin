import { ActionTree, MutationTree } from 'vuex'
import { Alert, AlertType } from './general'
import { Config } from '../api/api'

export const state = () => ({
  config: {} as Config,
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  SET_CONFIG(state, config: Config) {
    state.config = config
  },
}

export const actions: ActionTree<RootState, RootState> = {
  async get(context) {
    console.debug('Store config/get', 'Dispatched')
    return this.$api.config
      .getConfig()
      .then(({ data }) => {
        console.debug(data)
        context.commit('SET_CONFIG', data)
      })
      .catch((e) => {
        const alert: Alert = {
          type: AlertType.Error,
          message:
            this.$i18n
              .t('fetchItemFailed', { item: this.$i18n.tc('config', 1) })
              .toString() + `: ${e.message}`,
        }
        context.commit('general/SET_ALERT', alert, { root: true })
      })
  },
}
