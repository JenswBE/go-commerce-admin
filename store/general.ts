import { MutationTree } from 'vuex'

export type Alert = {
  type: AlertType
  message: string
}

export enum AlertType {
  // Based on https://vuetifyjs.com/en/api/v-alert/#props-type
  Success = 'success',
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
}

export const state = () => ({
  alert: {} as Alert,
})

export type RootState = ReturnType<typeof state>

export const mutations: MutationTree<RootState> = {
  SET_ALERT(state, alert: Alert) {
    state.alert = alert
  },

  CLEAR_ALERT(state) {
    state.alert = {} as Alert
  },
}
