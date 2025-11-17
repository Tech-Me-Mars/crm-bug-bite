<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError,
})

const handleGoHome = () => {
  navigateTo('/')
}

const handleGoBack = () => {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    navigateTo('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-amber-50 flex items-center justify-center p-4">
    <div class="max-w-2xl w-full">
      <!-- Error Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <!-- Red Header -->
        <div class="bg-gradient-to-br from-red-600 via-red-500 to-red-600 p-8 text-center">
          <div class="inline-block bg-white rounded-full p-4 mb-4 shadow-lg">
            <img
              src="/assets/images/bug-bite-icon.png"
              alt="Bug Bite Logo"
              class="w-20 h-20 rounded-full"
            >
          </div>
          <h1 class="text-5xl font-black text-yellow-300 mb-2 bug-bite-text">
            bugbite
          </h1>
          <p class="text-white text-sm font-medium">แมลงมันมันส์</p>
        </div>

        <!-- Error Content -->
        <div class="p-8 text-center">
          <!-- Error Icon -->
          <div class="text-8xl mb-6">
            {{ props.error?.statusCode === 404 ? '🔍' : '⚠️' }}
          </div>

          <!-- Error Code -->
          <div class="mb-4">
            <span class="text-6xl font-black text-red-600">
              {{ props.error?.statusCode || '404' }}
            </span>
          </div>

          <!-- Error Message -->
          <h2 class="text-2xl font-bold text-gray-800 mb-3">
            {{ props.error?.statusCode === 404 ? 'ไม่พบหน้าที่คุณต้องการ' : 'เกิดข้อผิดพลาด' }}
          </h2>

          <p class="text-gray-600 mb-8 max-w-md mx-auto">
            {{ props.error?.message || 'ขออภัย ดูเหมือนว่าหน้าที่คุณกำลังมองหาจะหายไปแล้ว หรืออาจจะไม่เคยมีอยู่จริง' }}
          </p>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
            <button
              class="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
              @click="handleGoHome"
            >
              🏠 กลับหน้าแรก
            </button>
            <button
              class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              @click="handleGoBack"
            >
              ← ย้อนกลับ
            </button>
          </div>

          <!-- Helpful Links -->
          <div class="mt-8 pt-8 border-t border-gray-200">
            <p class="text-sm text-gray-600 mb-4">ลิงก์ที่อาจเป็นประโยชน์:</p>
            <div class="flex flex-wrap justify-center gap-4">
              <NuxtLink
                to="/member"
                class="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                หน้าสมาชิก
              </NuxtLink>
              <NuxtLink
                to="/profile"
                class="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                โปรไฟล์
              </NuxtLink>
              <NuxtLink
                to="/orders"
                class="text-sm text-red-600 hover:text-red-700 font-medium hover:underline"
              >
                ประวัติการสั่งซื้อ
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <div class="text-center mt-6">
        <p class="text-sm text-gray-600">
          หากปัญหายังคงอยู่ กรุณาติดต่อเรา
        </p>
        <p class="text-xs text-gray-500 mt-2">
          โทร: 02-XXX-XXXX | เปิดทุกวัน 10:00 - 20:00
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

button {
  transition: all 0.3s ease;
}

button:active {
  transform: scale(0.98) !important;
}
</style>
