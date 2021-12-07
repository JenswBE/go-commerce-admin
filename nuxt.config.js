import colors from 'vuetify/es5/util/colors'

export default {
  server: {
    port: 3000, // default: 3000
    host: '0.0.0.0', // default: localhost
    timing: false,
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - GoCommerce',
    title: 'Manage',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: ['~/plugins/filters.ts', '~/plugins/api.ts'],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxt/typescript-build',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://i18n.nuxtjs.org/setup
    '@nuxtjs/i18n',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://auth.nuxtjs.org/
    '@nuxtjs/auth-next',
    'vue2-editor/nuxt',
  ],

  auth: {
    strategies: {
      token: {
        scheme: '~/plugins/keycloak.js',
      },
    },
    plugins: ['~/plugins/setLocale.ts'],
  },

  router: {
    middleware: ['auth'],
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    baseURL: 'http://localhost:8090/api',
  },

  publicRuntimeConfig: {
    goCommerce: {
      // URL template pointing to the public page of a product.
      // Product is available as variable `p`. E.g. `/products/${p.id}`.
      productURLTemplate:
        process.env.PRODUCT_URL_TEMPLATE || '/products/${p.id}',
    },

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
      browserBaseURL: process.env.BACKEND_URL_EXTERNAL,
    },

    auth: {
      strategies: {
        local: false,
        token: {
          endpoints: {
            configuration:
              process.env.AUTH_URL_OIDC_CONFIG ||
              'http://127.0.0.1:9001/auth/realms/go-commerce/.well-known/openid-configuration',
          },
          responseType: 'code',
          accessType: 'offline',
          grantType: 'authorization_code',
          codeChallengeMethod: 'S256',
          clientId: process.env.AUTH_CLIENT_ID || 'go-commerce-admin',
          scope: ['openid', 'profile', 'email'],
          state: process.env.AUTH_STATE || 'UNIQUE_AND_NON_GUESSABLE',
          logoutRedirectUri:
            process.env.AUTH_URL_LOGOUT_REDIRECT ||
            'http://localhost:3000/login',
        },
      },
    },
  },

  privateRuntimeConfig: {
    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {
      baseURL: process.env.BACKEND_URL_INTERNAL,
    },
  },

  i18n: {
    locales: [
      {
        name: 'English',
        code: 'en',
        file: 'en.ts',
      },
      {
        name: 'Nederlands',
        code: 'nl',
        file: 'nl.ts',
      },
    ],
    defaultLocale: 'en',
    langDir: '~/locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      onlyOnRoot: false,
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
