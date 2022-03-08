import { ActionTree } from 'vuex'

export const state = () => ({})
export type RootState = ReturnType<typeof state>

export const actions: ActionTree<RootState, RootState> = {
  async nuxtServerInit({ dispatch }, context) {
    await dispatch('config/get', { root: true })
  },
}
