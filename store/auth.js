export const state = () => ({
  isLoggedIn: false,
})

export const mutations = {
  SET_LOGIN(state) {
    state.isLoggedIn = true
  },

  CLEAR_LOGIN(state) {
    state.isLoggedIn = false
  },
}

export const actions = {
  async login(context, plainCreds) {
    console.debug('Store auth/login', 'Dispatched')

    // Build basic auth credentials
    const basicCreds = Buffer.from(plainCreds).toString('base64')
    const authHeader = `Basic ${basicCreds}`

    // Validate credentials
    return this.$api.products
      .adminListProducts(undefined, { headers: { Authorization: authHeader } })
      .then(() => {
        context.commit('SET_LOGIN')
        localStorage.setItem('plainCreds', plainCreds)
        this.$axios.defaults.headers.common['Authorization'] = authHeader
      })
      .catch((e) => {
        console.debug('Store auth/login', 'Error in auth check', e)
        let msg = `Login mislukt: ${e.message}`
        if (e.response && e.response.status === 401) {
          msg = 'Gebruikersnaam of wachtwoord fout'
        }
        context.commit(
          'general/SET_ALERT',
          { type: 'error', message: msg },
          { root: true }
        )
        throw new Error(msg)
      })
  },

  async logout(context) {
    console.debug('Store auth/logout', 'Dispatched')
    localStorage.removeItem('plainCreds')
    context.commit('CLEAR_LOGIN')
  },
}
