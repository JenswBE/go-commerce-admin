export const state = () => ({
  alert: {},
});

export const mutations = {
  SET_ALERT(state, alert) {
    state.alert = alert;
  },

  CLEAR_ALERT(state) {
    state.alert = {};
  },
};
