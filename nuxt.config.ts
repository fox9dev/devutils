// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/ui', '@nuxtjs/i18n'],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      title: 'DevUtils - 开发者实用工具箱',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            '一站式开发者工具箱，提供 JSON 格式化、Base64 编解码、URL 编解码、文本对比等常用开发工具。本地运行，隐私安全，离线可用。'
        },
        {
          name: 'keywords',
          content:
            'DevUtils, 开发工具, JSON格式化, Base64, URL编解码, 文本对比, 时间戳转换'
        },
        { property: 'og:title', content: 'DevUtils - 开发者实用工具箱' },
        {
          property: 'og:description',
          content:
            '一站式开发者工具箱，提供 JSON 格式化、Base64 编解码等常用开发工具。'
        },
        { property: 'og:type', content: 'website' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: ''
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
      ]
    }
  },

  css: ['~/assets/css/main.css'],

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
    '/workspace/**': { ssr: false }
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
