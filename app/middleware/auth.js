// middleware/auth.js
export default defineNuxtRouteMiddleware(async () => {
  const token = await useDecryptedCookie('token') // <- เข้ารหัสไว้แล้ว

  if (!token) {
    return navigateTo('/auth/login')
  }
})
