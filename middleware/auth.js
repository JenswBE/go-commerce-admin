const LOGIN_PATH = '/login'

export default function ({ app, route, store }) {
  // Check if already logged in
  const loggedIn = store.state.auth.isLoggedIn
  if (loggedIn === true) {
    // Already logged in
    console.debug('MW Auth', 'Already logged in')
    if (route.path === LOGIN_PATH) {
      app.router.push('/')
    }
    return
  }

  // Check if credentials are set
  const plainCreds = localStorage.getItem('plainCreds') || ''
  if (plainCreds !== '') {
    // Credentials are set => Validate
    console.debug('MW Auth', 'plainCreds set => Validate')
    return store
      .dispatch('auth/login', plainCreds)
      .then(() => {
        if (route.path !== LOGIN_PATH) {
          console.debug('MW Auth', 'plainCreds valid => Stay on page')
          return
        }
        console.debug('MW Auth', 'plainCreds valid => Redirect login to root')
        app.router.push('/')
      })
      .catch(() => {
        console.debug('MW Auth', 'plainCreds not valid => Redirect to login')
        localStorage.removeItem('plainCreds')
        app.router.push(LOGIN_PATH)
      })
  }

  // Ignore requests to login page
  if (route.path === LOGIN_PATH) {
    console.debug('MW Auth', 'Not authenticated => Ignore login page')
    return
  }

  // Not logged in and no creds set => Redirect to login page
  console.debug('MW Auth', 'Not authenticated => Redirect to login')
  app.router.push(LOGIN_PATH)
}
