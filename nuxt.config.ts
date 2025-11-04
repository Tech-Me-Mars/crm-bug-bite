// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    cookieSecret: process.env.COOKIE_SECRET,
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