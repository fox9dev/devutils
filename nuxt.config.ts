// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/sitemap'],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      htmlAttrs: { lang: 'zh-CN' },
      titleTemplate: 'DevUtils - %s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'author', content: 'DevUtils' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#0ea5e9' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'DevUtils' },
        { property: 'og:locale', content: 'zh_CN' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
        { rel: 'canonical', href: 'https://devutils.fox9.dev' }
      ],
      script: [
        {
          tagPriority: 'critical',
          innerHTML: `(function(){try{if(document.cookie.includes('devutils-sidebar-collapsed=true'))document.documentElement.classList.add('sidebar-collapsed-init')}catch(e){}})()`
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: 'https://devutils.fox9.dev'
  },

  colorMode: {
    preference: 'light',
    fallback: 'light'
  },

  ui: {
    fonts: false,
    theme: {
      defaultVariants: {
        size: 'lg'
      }
    }
  },

  routeRules: {
    '/': { prerender: true },
    '/tools': { prerender: true },
    '/workspace': { prerender: true },
    '/workspace/*': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
