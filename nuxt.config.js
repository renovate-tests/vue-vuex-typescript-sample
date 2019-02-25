const parseArgs = require('minimist')
const argv = parseArgs(process.argv.slice(2), {
  alias: {
    H: 'hostname',
    p: 'port'
  },
  string: ['H'],
  unknown: parameter => false
})

const port = argv.port || process.env.PORT || process.env.npm_package_config_nuxt_port || '3100'
const host = argv.hostname || process.env.HOST || process.env.npm_package_config_nuxt_host || 'localhost'
const bodyParser = require('body-parser')

module.exports = {
  env: {
    baseUrl: process.env.BASE_URL || `http://${host}:${port}`
  },
  srcDir: 'src',
  head: {
    title: 'nuxt.js with typescript',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  css: ['~/assets/css/main.scss'],
  build: {
    useForkTsChecker: true,
    extractCSS: true,
    extend: require('./extend.webpack.config'),
    stats: {
      warningsFilter: /export .* was not found in/,
    },
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    ['nuxt-i18n', {
      parsePages: false,
      defaultLocale: 'en',
      rootRedirect: 'en',
      lazy: true,
      locales: [
        { code: 'en', iso: 'en-US', file: 'en.ts' },
        { code: 'ja', iso: 'ja',  file: 'ja.ts' },
      ],
      langDir: 'i18n/',
      strategy: 'prefix',
      detectBrowserLanguage: {
        useCookie: true,
      },
    }],
  ],
  plugins: [
    '~/plugins/axios_cookie_proxy.ts',
  ],
  axios: {
    prefix: '/api',
    proxy: true,
  },
  proxy: {
    '/api': 'http://localhost:3101'
  },
  auth: {
    plugins: ['~/plugins/auth/redirect.ts'],
    strategies: {
      local: {
        endpoints: {
          login:  { url: '/users/sign_in' },
          logout: { url: '/users/sign_out', method: 'delete' },
          user:  { url: '/users/show', propertyName: 'user' },
        },
        tokenRequired: false,
      },
    },
    rewriteRedirects: false,
    fullPathRedirect: true,
  },
  router: {
    middleware: ['auth']
  },
  serverMiddleware: [
    bodyParser.urlencoded({ extended: true })
  ]
}
