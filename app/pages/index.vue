<script setup>
// Disable default layout (no header for this page)
definePageMeta({
  layout: false
})

const config = useRuntimeConfig()
const liff = useLiff()
const api = useApi()

// Loading states
const isLoading = ref(true)
const loadingMessage = ref('กำลังเตรียมระบบ...')
const errorMessage = ref('')

// Initialize LIFF and authenticate
const initializeApp = async () => {
  try {
    // Step 1: Initialize LIFF
    loadingMessage.value = 'กำลังเชื่อมต่อกับ LINE...'
    const initialized = await liff.initLiff()

    if (!initialized) {
      errorMessage.value = 'ไม่สามารถเชื่อมต่อกับ LINE ได้'
      return
    }

    // Step 2: Get LINE profile
    if (liff.isLoggedIn.value) {
      loadingMessage.value = 'กำลังตรวจสอบข้อมูล...'
      const profile = await liff.getProfile()

      // Step 3: Authenticate with backend
      loadingMessage.value = 'กำลังเข้าสู่ระบบ...'

      try {
        // Call API to check login with userId
        const response = await api.post('/auth/line', {
          userId: profile.userId
        })

        console.log('API Response:', response.data)

        // Check response status
        if (response.data.status === true) {
          // Success - Save token and data to localStorage
          if (import.meta.client) {
            // Save token
            localStorage.setItem('token', response.data.token)

            // Save customer data from backend
            localStorage.setItem('customer_data', JSON.stringify(response.data.data))

            // Save LINE profile info with point and created_at
            localStorage.setItem('user_info', JSON.stringify({
              userId: profile.userId,
              displayName: profile.displayName,
              pictureUrl: profile.pictureUrl,
              fullname: response.data.data.fullname,
              phone_no: response.data.data.phone_no,
              point: response.data.data.point || '0',
              created_at: response.data.data.created_at || null
            }))
          }

          // Step 4: Redirect to member page immediately
          loadingMessage.value = 'เสร็จสิ้น!'
          navigateTo('/member', { replace: true })
        } else {
          // Status is false - User not registered, go to register page
          console.log('User not registered, redirecting to register page')

          // Save LINE profile to localStorage for registration
          if (import.meta.client) {
            localStorage.setItem('line_profile', JSON.stringify(profile))
          }

          navigateTo('/register', { replace: true })
        }
      } catch (error) {
        console.error('API authentication error:', error)

        // If API call fails completely, show error
        if (error.response?.data?.message) {
          errorMessage.value = error.response.data.message
        } else {
          errorMessage.value = 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง'
        }
      }
    }
  } catch (error) {
    console.error('Initialization error:', error)
    errorMessage.value = error.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  } finally {
    isLoading.value = false
  }
}

// Retry initialization
const handleRetry = () => {
  errorMessage.value = ''
  isLoading.value = true
  initializeApp()
}

// Initialize on mount
onMounted(() => {
  initializeApp()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-600 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Loading State -->
      <div v-if="isLoading && !errorMessage" class="text-center">
        <!-- Logo -->
        <div class="inline-block bg-white rounded-full p-6 mb-8 shadow-2xl animate-bounce">
          <img
            src="/assets/images/bug-bite-icon.png"
            alt="Bug Bite Logo"
            class="w-24 h-24 rounded-full"
          >
        </div>

        <!-- App Name -->
        <h1 class="text-5xl font-black text-yellow-300 mb-4 bug-bite-text">
          bugbite
        </h1>
        <p class="text-white text-lg font-bold mb-8">
          แมลงมันมันส์
        </p>

        <!-- Loading Spinner -->
        <div class="flex justify-center mb-6">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-white" />
        </div>

        <!-- Loading Message -->
        <p class="text-white text-lg font-medium mb-4">
          {{ loadingMessage }}
        </p>

        <!-- Progress Dots -->
        <div class="flex justify-center gap-2">
          <div class="w-3 h-3 bg-white rounded-full animate-pulse" />
          <div class="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-200" />
          <div class="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-400" />
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="bg-white rounded-2xl shadow-2xl p-8 text-center">
        <!-- Error Icon -->
        <div class="text-6xl mb-4">⚠️</div>

        <!-- Error Title -->
        <h2 class="text-2xl font-bold text-gray-800 mb-3">
          เกิดข้อผิดพลาด
        </h2>

        <!-- Error Message -->
        <p class="text-gray-600 mb-6">
          {{ errorMessage }}
        </p>

        <!-- Retry Button -->
        <button
          class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          @click="handleRetry"
        >
          ลองอีกครั้ง
        </button>

        <!-- Help Text -->
        <p class="text-sm text-gray-500 mt-4">
          หากปัญหายังคงอยู่ กรุณาติดต่อเรา<br>
          โทร: {{ config.public.contactPhone }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bug-bite-text {
  text-shadow:
    3px 3px 0px #f59e0b,
    -1px -1px 0px #f59e0b,
    1px -1px 0px #f59e0b,
    -1px 1px 0px #f59e0b,
    1px 1px 0px #f59e0b,
    4px 4px 8px rgba(0, 0, 0, 0.3);
  font-family: 'Arial Black', sans-serif;
  letter-spacing: 0.1em;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Pulse animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Animation delay utilities */
.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

/* Bounce animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-bounce {
  animation: bounce 2s ease-in-out infinite;
}
</style>
