export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'Movie Database - Admin',
    meta: [
      { charset: 'utf-8' },
      // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/logo.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {
      color: '#0084B0',
      throttle: 0,
      height: '4px'
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    '~/assets/stylus/app.styl'
  ],


  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~/plugins/v-select.js', ssr: false },
    { src: '~/plugins/vue-ctk-date-time-picker', ssr: false },
    { src: '~/plugins/vue-datepicker', ssr: false },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/vue-click-outside' },
    { src: '~/plugins/mixins'},
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: false,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxtjs/dotenv'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'admin',
          // autoFetch: true
        },
        endpoints: {
          login: { url: '/admins/sign_in', method: 'post', propertyName: 'token' },
          logout: { url: '/admins/sign_out', method: 'delete' },
          user: { url: '/admins/current', method: 'get', propertyName: 'admin' }
        }
      }
    }
  },

  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL,
    credentials: false
  },
  env: {
    baseUrl: process.env.BASE_URL
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    maxChunkSize: 300000
  },
  server: {
    port: process.env.PORT
  }
}
