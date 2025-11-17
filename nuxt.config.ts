// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    // Private keys (only available server-side)
    cookieSecret: process.env.COOKIE_SECRET || 'default-secret-key',

    // Public keys (exposed to client)
    public: {
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:8000/api',
      apiTimeout: process.env.API_TIMEOUT || '30000',
      appName: process.env.APP_NAME || 'Bug Bite CRM',
      appUrl: process.env.APP_URL || 'http://localhost:3000'
    }
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/scripts',
    // '@nuxt/test-utils',
    '@nuxt/ui'
  ],
  css: [
    '@/assets/css/main.css', // ถ้าไฟล์อยู่ที่ app/assets/css/main.css ใช้ path นี้ได้เลย
  ],
  ui: {
    colorMode:false,
    theme: {
      // บอก Nuxt UI ว่ามี semantic color อะไรบ้าง
      colors: [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'error',
        'neutral'
      ]
    }
  }
})