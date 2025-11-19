<script setup>
import { ref } from 'vue'

definePageMeta({
   layout: false,
  middleware: 'auth' // Require authentication
})

const config = useRuntimeConfig()
const api = useApi()

// Branch data
const branches = ref([])
const isLoading = ref(true)
const totalBranches = ref(0)
const errorMessage = ref('')

// Fetch branches from API
const fetchBranches = async () => {
  try {
    isLoading.value = true
    errorMessage.value = ''

    const response = await api.get('/crmbugbite/v1/branches')

    if (response.data.status === true) {
      branches.value = response.data.data.branches || []
      totalBranches.value = response.data.data.total || 0
    } else {
      errorMessage.value = response.data.message || 'ไม่สามารถดึงข้อมูลสาขาได้'
    }
  } catch (error) {
    console.error('Error fetching branches:', error)
    errorMessage.value = 'เกิดข้อผิดพลาดในการดึงข้อมูลสาขา'
  } finally {
    isLoading.value = false
  }
}

// Initialize on mount
onMounted(() => {
  fetchBranches()
})

// Format phone number
const formatPhone = (phone) => {
  if (!phone) return '-'
  // Format: 099-090-9090
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')
}

// Open map (if lat/long available)
const openMap = (branch) => {
  if (branch.lat && branch.long && branch.lat !== '0' && branch.long !== '0') {
    const url = `https://www.google.com/maps?q=${branch.lat},${branch.long}`
    window.open(url, '_blank')
  }
}

// Call phone
const callPhone = (phone) => {
  if (phone) {
    window.location.href = `tel:${phone}`
  }
}

// Send email
const sendEmail = (email) => {
  if (email) {
    window.location.href = `mailto:${email}`
  }
}
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Simple Header -->
    <div class="bg-gradient-to-br from-red-600 via-red-500 to-red-600 sticky top-0 z-40 shadow-lg">
      <UContainer>
        <div class="flex items-center justify-between py-4">
          <!-- Back Button -->
          <button
            class="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
            aria-label="กลับ"
            @click="navigateTo('/member')"
          >
            <UIcon name="i-heroicons-arrow-left" class="text-2xl text-white" />
          </button>

          <!-- Title -->
          <div class="flex items-center gap-3">
            <span class="text-3xl">📍</span>
            <h1 class="text-2xl font-black text-white">ติดต่อเรา</h1>
          </div>

          <!-- Placeholder for balance -->
          <div class="w-10" />
        </div>
      </UContainer>
    </div>

    <!-- Main Content -->
    <UContainer class="py-8">
      <!-- Page Description -->
      <div class="mb-6">
        <p class="text-gray-600 text-center">ข้อมูลสาขาและช่องทางการติดต่อ</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-20">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-red-600" />
        <p class="text-gray-600 mt-4 font-medium">กำลังโหลดข้อมูล...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="errorMessage" class="text-center py-20">
        <div class="text-6xl mb-4">⚠️</div>
        <p class="text-red-600 font-bold text-lg">{{ errorMessage }}</p>
        <button
          class="mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
          @click="fetchBranches"
        >
          ลองใหม่อีกครั้ง
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="branches.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">🏪</div>
        <p class="text-gray-600 font-medium">ยังไม่มีข้อมูลสาขา</p>
      </div>

      <!-- Branches List -->
      <div v-else class="space-y-6">
        <!-- Total Count -->
        <div class="bg-white rounded-xl p-4 border border-gray-200">
          <p class="text-gray-600 text-sm">
            พบ <span class="font-bold text-red-600">{{ totalBranches }}</span> สาขา
          </p>
        </div>

        <!-- Branch Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            v-for="branch in branches"
            :key="branch.id"
            class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
          >
            <!-- Card Header -->
            <div class="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
              <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span class="text-2xl">🏪</span>
                  </div>
                  <div>
                    <h3 class="text-xl font-black">{{ branch.branch_name }}</h3>
                    <p class="text-white/80 text-sm">สาขา #{{ branch.id }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6 space-y-4">
              <!-- Address -->
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-map-pin" class="text-xl text-red-600" />
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-500 mb-1">ที่อยู่</p>
                  <p class="text-gray-800 font-medium">{{ branch.address || '-' }}</p>
                </div>
              </div>

              <!-- Phone -->
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-phone" class="text-xl text-green-600" />
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-500 mb-1">เบอร์โทรศัพท์</p>
                  <button
                    v-if="branch.phone_number"
                    class="text-gray-800 font-medium hover:text-green-600 transition-colors"
                    @click="callPhone(branch.phone_number)"
                  >
                    {{ formatPhone(branch.phone_number) }}
                  </button>
                  <p v-else class="text-gray-400">-</p>
                </div>
              </div>

              <!-- Email -->
              <div class="flex gap-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UIcon name="i-heroicons-envelope" class="text-xl text-blue-600" />
                  </div>
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-500 mb-1">อีเมล</p>
                  <button
                    v-if="branch.email"
                    class="text-gray-800 font-medium hover:text-blue-600 transition-colors break-all"
                    @click="sendEmail(branch.email)"
                  >
                    {{ branch.email }}
                  </button>
                  <p v-else class="text-gray-400">-</p>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="pt-4 border-t border-gray-100">
                <button
                  v-if="branch.lat && branch.long && branch.lat !== '0' && branch.long !== '0'"
                  class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  @click="openMap(branch)"
                >
                  <UIcon name="i-heroicons-map" class="text-xl" />
                  <span>ดูแผนที่</span>
                </button>
                <div v-else class="text-center text-gray-400 text-sm py-2">
                  ยังไม่มีข้อมูลพิกัด
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Business Hours Info -->
      <div class="mt-12 mb-8 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white text-center shadow-xl">
        <div class="text-4xl mb-4">⏰</div>
        <h3 class="text-2xl font-black mb-2">เวลาทำการ</h3>
        <p class="text-xl text-white/90">{{ config.public.businessHours }}</p>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
/* Smooth hover effects */
.hover\:shadow-xl {
  transition: box-shadow 0.3s ease;
}

/* Animation for loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
