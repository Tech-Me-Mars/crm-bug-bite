<script setup>
import { ref } from 'vue'

// Disable default layout for this page
definePageMeta({
  layout: false,
  middleware: 'auth' // Require authentication
})

const config = useRuntimeConfig()
const api = useApi()

// User data
const userId = ref('')
const userPoint = ref(0)
const isChecking = ref(true)
const isRedeeming = ref(false)

// Get userId from localStorage
const getUserId = () => {
  if (import.meta.client) {
    const userInfo = localStorage.getItem('user_info')
    if (userInfo) {
      const user = JSON.parse(userInfo)
      userId.value = user.userId || ''
    }
  }
}

// Check if user has enough points
const checkPoints = async () => {
  try {
    if (!userId.value) {
      navigateTo('/member', { replace: true })
      return
    }

    isChecking.value = true

    const response = await api.post('/crmbugbite/v1/point', {
      userId: userId.value
    })

    if (response.data.status === true) {
      userPoint.value = Number(response.data.data.point || '0')

      // If points < 10, redirect back to member page
      if (userPoint.value < 10) {
        navigateTo('/member', { replace: true })
        return
      }
    } else {
      navigateTo('/member', { replace: true })
    }
  } catch (error) {
    console.error('Error checking points:', error)
    navigateTo('/member', { replace: true })
  } finally {
    isChecking.value = false
  }
}

// Handle redeem
const handleRedeem = async () => {
  try {
    isRedeeming.value = true

    // TODO: Call redeem API endpoint
    // const response = await api.post('/crmbugbite/v1/redeem', {
    //   userId: userId.value
    // })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // After successful redeem, redirect to member page
    navigateTo('/member', { replace: true })
  } catch (error) {
    console.error('Error redeeming:', error)
  } finally {
    isRedeeming.value = false
  }
}

// Cancel redeem
const handleCancel = () => {
  navigateTo('/member')
}

// Initialize on mount
onMounted(() => {
  getUserId()
  checkPoints()
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-red-600 flex items-center justify-center p-4">
    <!-- Checking Points State -->
    <div v-if="isChecking" class="text-center">
      <div class="inline-block bg-white rounded-full p-6 mb-6 shadow-2xl animate-bounce">
        <span class="text-6xl">🎁</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">กำลังตรวจสอบคะแนน...</h2>
      <div class="flex justify-center gap-2">
        <div class="w-3 h-3 bg-white rounded-full animate-pulse" />
        <div class="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-200" />
        <div class="w-3 h-3 bg-white rounded-full animate-pulse animation-delay-400" />
      </div>
    </div>

    <!-- Redeem Content -->
    <div v-else class="max-w-md w-full">
      <!-- Success Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-yellow-400 to-yellow-500 p-8 text-center relative overflow-hidden">
          <!-- Confetti Background -->
          <div class="absolute inset-0 opacity-20">
            <div class="absolute top-0 left-1/4 text-4xl animate-float">🎉</div>
            <div class="absolute top-10 right-1/4 text-3xl animate-float-delay-1">✨</div>
            <div class="absolute bottom-10 left-1/3 text-3xl animate-float-delay-2">🎊</div>
            <div class="absolute bottom-5 right-1/3 text-2xl animate-float">⭐</div>
          </div>

          <!-- Main Icon -->
          <div class="relative">
            <div class="inline-block bg-white rounded-full p-6 mb-4 shadow-xl animate-bounce-slow">
              <span class="text-7xl">🎁</span>
            </div>
            <h1 class="text-3xl font-black text-red-700 mb-2">ยินดีด้วย!</h1>
            <p class="text-red-600 font-bold text-lg">คุณมีสิทธิ์แลกของรางวัล</p>
          </div>
        </div>

        <!-- Content -->
        <div class="p-8">
          <!-- Points Display -->
          <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-6 border-2 border-red-200">
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-2">คะแนนสะสมของคุณ</p>
              <div class="flex items-center justify-center gap-3 mb-3">
                <span class="text-5xl font-black text-red-600">{{ userPoint }}</span>
                <span class="text-2xl text-gray-600">คะแนน</span>
              </div>
              <div class="bg-white rounded-full h-3 overflow-hidden">
                <div
                  class="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full transition-all"
                  style="width: 100%"
                />
              </div>
              <p class="text-xs text-green-600 font-bold mt-2">✓ ครบเป้าหมาย 10 คะแนน!</p>
            </div>
          </div>

          <!-- Reward Info -->
          <div class="bg-gray-50 rounded-xl p-4 mb-6">
            <h3 class="font-bold text-gray-800 mb-2 flex items-center gap-2">
              <span class="text-xl">🎁</span>
              <span>รางวัลที่จะได้รับ</span>
            </h3>
            <p class="text-sm text-gray-600 mb-2">• เมนูแมลงทอดฟรี 1 รายการ (มูลค่า 50 บาท)</p>
            <p class="text-xs text-gray-500">* เงื่อนไข: ใช้ได้ภายใน 7 วัน นับจากวันแลกรางวัล</p>
          </div>

          <!-- Note -->
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div class="flex gap-2">
              <span class="text-yellow-600 text-lg flex-shrink-0">ℹ️</span>
              <div>
                <p class="text-sm text-yellow-800 font-semibold mb-1">หมายเหตุ</p>
                <p class="text-xs text-yellow-700">
                  เมื่อกดแลกรางวัล คะแนน 10 แก้วของคุณจะถูกหักทันที และไม่สามารถยกเลิกได้
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <!-- Redeem Button -->
            <button
              type="button"
              class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-black py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isRedeeming"
              @click="handleRedeem"
            >
              <span v-if="!isRedeeming" class="flex items-center justify-center gap-2">
                <span class="text-xl">🎉</span>
                <span>ยืนยันการแลกรางวัล</span>
              </span>
              <span v-else>กำลังดำเนินการ...</span>
            </button>

            <!-- Cancel Button -->
            <button
              type="button"
              class="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200"
              :disabled="isRedeeming"
              @click="handleCancel"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-6 text-center">
        <p class="text-white text-sm">
          Bug Bite - แมลงมันมันส์
        </p>
        <p class="text-white/80 text-xs mt-1">
          โทร: {{ config.public.contactPhone }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Float animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

.animate-float-delay-1 {
  animation: float 3s ease-in-out infinite;
  animation-delay: 1s;
}

.animate-float-delay-2 {
  animation: float 3s ease-in-out infinite;
  animation-delay: 2s;
}

/* Bounce slow animation */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* Animation delays for loading dots */
.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
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
