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
      appUrl: process.env.APP_URL || 'http://localhost:3000',
      liffId: process.env.LIFF_ID || '',
      contactPhone: process.env.CONTACT_PHONE || '02-XXX-XXXX',
      contactMobile: process.env.CONTACT_MOBILE || '081-XXX-XXXX',
      contactAddress: process.env.CONTACT_ADDRESS || '',
      businessHours: process.env.BUSINESS_HOURS || 'เปิดทุกวัน 10:00 - 20:00'
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
  },

  // Vite configuration - Allow external hosts (for tunnels like ngrok, cloudflare)
  vite: {
    server: {
      hmr: {
        clientPort: process.env.HMR_CLIENT_PORT ? parseInt(process.env.HMR_CLIENT_PORT) : undefined
      }
    }
  },

  // Development server configuration
  devServer: {
    host: '0.0.0.0', // Allow external access
    port: 3000
  }
})