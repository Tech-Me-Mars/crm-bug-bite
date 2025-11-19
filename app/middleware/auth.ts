export default defineNuxtRouteMiddleware((to, from) => {
  // Skip auth check for public pages
  const publicPages = ['/', '/register', '/redeem']
  if (publicPages.includes(to.path)) {
    return
  }

  // Only run on client side
  if (import.meta.client) {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token')

    // If no token, abort and redirect immediately to index page
    if (!token) {
      return navigateTo('/', { replace: true })
    }
  }

  // SSR: Skip middleware on server side
  // Token will be checked when page loads on client
})
