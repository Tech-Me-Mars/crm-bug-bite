<script setup>
import { ref } from 'vue'

const config = useRuntimeConfig()
const api = useApi()

const isMenuOpen = ref(false)
const isHistoryOpen = ref(false)

const menuItems = [
  { label: 'หน้าแรก', icon: 'i-heroicons-home', route: '/' },
  { label: 'สมาชิก', icon: 'i-heroicons-user-group', route: '/profile' },
  { label: 'ติดต่อเรา', icon: 'i-heroicons-phone', route: '/contact' }
]

// Member Cups Data (พร้อมรับข้อมูลจาก API)
const memberCups = ref({
  current: 0, // จำนวนแก้วปัจจุบัน (ดึงจาก API)
  target: 10  // เป้าหมาย 10 แก้ว
})

// Redeem History Data
const redeemHistory = ref({
  current_point: '0',
  total_transactions: 0,
  transactions: []
})

const isLoadingHistory = ref(false)

// User ID
const userId = ref('')

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

// Check if member can redeem (ครบ 10 แก้ว)
const canRedeem = computed(() => memberCups.value.current >= memberCups.value.target)

// Fetch member cups (point) from API
const fetchMemberCups = async () => {
  try {
    if (!userId.value) return

    const response = await api.post('/crmbugbite/v1/point', {
      userId: userId.value
    })

    if (response.data.status === true) {
      memberCups.value.current = Number(response.data.data.point || '0')
    }
  } catch (error) {
    console.error('Error fetching member cups:', error)
  }
}

// Fetch redeem history from API
const fetchRedeemHistory = async () => {
  try {
    if (!userId.value) return

    isLoadingHistory.value = true

    const response = await api.post('/crmbugbite/v1/redeem/history', {
      userId: userId.value
    })

    if (response.data.status === true) {
      redeemHistory.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching redeem history:', error)
  } finally {
    isLoadingHistory.value = false
  }
}

// Initialize on mount
onMounted(() => {
  getUserId()
  fetchMemberCups()
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  // Close history panel when opening menu
  if (isMenuOpen.value) {
    isHistoryOpen.value = false
  }
}

const toggleHistory = () => {
  isHistoryOpen.value = !isHistoryOpen.value
  // Close menu when opening history
  if (isHistoryOpen.value) {
    isMenuOpen.value = false
    if (redeemHistory.value.transactions.length === 0) {
      fetchRedeemHistory()
    }
  }
}

const _handleNavigate = (route) => {
  isMenuOpen.value = false
  navigateTo(route)
}

// Format date to Thai format
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Get status badge color
const getStatusColor = (status) => {
  return status === 1 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
}
</script>

<template>
  <div class="relative">
    <!-- Red Header Section -->
    <div class="bg-gradient-to-br from-red-600 via-red-500 to-red-600 relative pb-8">
      <!-- Hamburger Menu Button -->
      <div class="fixed top-4 right-4 z-50">
        <button
          @click="toggleMenu"
          class="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
          aria-label="Toggle menu"
        >
          <div class="w-6 h-5 flex flex-col justify-between">
            <span
              :class="[
                'block h-0.5 bg-white transition-all',
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              ]"
            ></span>
            <span
              :class="[
                'block h-0.5 bg-white transition-all',
                isMenuOpen ? 'opacity-0' : ''
              ]"
            ></span>
            <span
              :class="[
                'block h-0.5 bg-white transition-all',
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              ]"
            ></span>
          </div>
        </button>
      </div>

      <!-- Logo Section -->
      <div class="flex justify-center pt-6 pb-4">
        <div class="relative">
          <!-- Main Logo Circle -->
          <div class="bg-white rounded-full p-2 shadow-2xl">
            <div class="bg-gradient-to-br from-blue-900 to-blue-700 rounded-full p-4 relative overflow-hidden">
              <!-- Bug Bite Logo Image -->
              <div class="relative w-32 h-32 flex items-center justify-center">
                <img
                  src="/assets/images/bug-bite-icon.png"
                  alt="Bug Bite Logo"
                  class="w-full h-full object-cover rounded-full"
                  @error="(e) => e.target.innerHTML = '<div class=\'text-6xl\'>🐛</div>'"
                />
              </div>
            </div>
          </div>

          <!-- Bug Bite Text -->
          <div class="absolute -bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
            <h1 class="text-5xl font-black text-yellow-300 tracking-wider bug-bite-text">
              bugbite
            </h1>
            <p class="text-white text-base font-bold mt-1 tracking-wide">
              แมลงมันมันส์
            </p>
          </div>
        </div>
      </div>

      <!-- Spacer for text -->
      <div class="h-12"></div>

      <!-- Wavy Bottom Border -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
          class="w-full h-8"
        >
          <path
            d="M0,30 Q150,0 300,30 T600,30 T900,30 T1200,30 L1200,60 L0,60 Z"
            fill="#fef3c7"
            class="drop-shadow-lg"
          />
        </svg>
      </div>
    </div>

    <!-- Member Points Card Section -->
    <div class="bg-amber-50 py-6">
      <UContainer>
        <!-- Main Points Card -->
        <div class="relative overflow-hidden rounded-3xl shadow-2xl">
          <!-- Background Gradient -->
          <div class="absolute inset-0 bg-gradient-to-br from-red-400 via-red-500 to-red-600"></div>

          <!-- Pattern Overlay -->
          <div class="absolute inset-0 opacity-10">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;"></div>
          </div>

          <!-- Card Content -->
          <div class="relative p-6">
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <span class="text-2xl">🥤</span>
                </div>
                <div>
                  <h3 class="text-white font-bold text-lg">บัตรสมาชิก</h3>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <!-- History Button -->
                <button
                  type="button"
                  class="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                  @click="toggleHistory"
                  aria-label="ดูประวัติการแลก"
                >
                  <UIcon name="i-heroicons-clock" class="text-xl text-white" />
                </button>
                <!-- Success Badge (Clickable) -->
                <button
                  v-if="canRedeem"
                  type="button"
                  class="relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-700 text-xs font-black px-4 py-2 rounded-xl shadow-lg animate-pulse-glow hover:from-yellow-500 hover:to-yellow-600 transition-all cursor-pointer"
                  @click="navigateTo('/redeem')"
                >
                  <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent shimmer"></div>
                  <div class="relative flex items-center gap-1.5">
                    <span class="text-base">🎉</span>
                    <span>แลกได้!</span>
                  </div>
                </button>
              </div>
            </div>

            <!-- Cups Display -->
            <div class="bg-white/20 backdrop-blur-md rounded-2xl p-5">
              <div class="text-center">
                <p class="text-white/90 text-sm font-medium mb-1">แก้วสะสม</p>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-5xl font-black text-white">{{ memberCups.current }}</span>
                  <span class="text-2xl font-bold text-white/80">แก้ว</span>
                </div>
                <div class="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="canRedeem ? 'bg-green-400' : 'bg-white'"
                    :style="{ width: `${(memberCups.current / memberCups.target) * 100}%` }"
                  ></div>
                </div>
                <p class="text-white/80 text-xs mt-2">
                  <span v-if="!canRedeem">อีก {{ memberCups.target - memberCups.current }} แก้ว ถึงเป้าหมาย ({{ memberCups.target }} แก้ว)</span>
                  <span v-else class="text-green-200 font-bold">🎉 สำเร็จ! คุณสามารถแลกรางวัลได้แล้ว</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </div>

    <!-- Navigation Slide Menu -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isMenuOpen"
        class="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 overflow-y-auto"
      >
        <!-- Menu Header -->
        <div class="bg-gradient-to-br from-red-600 to-red-500 p-6 text-white">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full overflow-hidden bg-white/20 flex-shrink-0">
              <img
                src="/assets/images/bug-bite-icon.png"
                alt="Bug Bite"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 class="text-xl font-bold">bugbite</h2>
              <p class="text-sm text-white/90 font-medium">แมลงมันมันส์</p>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <nav class="p-4">
          <ul class="space-y-2">
            <li v-for="item in menuItems" :key="item.route">
              <NuxtLink
                :to="item.route"
                @click="navigateTo(item.route)"
                class="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <UIcon
                  :name="item.icon"
                  class="text-2xl text-gray-600 group-hover:text-red-600"
                />
                <span class="font-medium text-gray-800 group-hover:text-red-600">
                  {{ item.label }}
                </span>
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- Menu Footer -->
        <div class="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t">
          <div class="text-center space-y-2">
            <p class="text-sm text-gray-600">{{ config.public.businessHours }}</p>
            <p class="text-xs text-gray-500">โทร: {{ config.public.contactPhone }}</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMenuOpen || isHistoryOpen"
        @click="isMenuOpen ? toggleMenu() : toggleHistory()"
        class="fixed inset-0 bg-black/50 z-30"
      ></div>
    </Transition>

    <!-- Redeem History Slide Panel -->
    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <div
        v-if="isHistoryOpen"
        class="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-40 overflow-y-auto"
      >
        <!-- History Header -->
        <div class="sticky top-0 bg-gradient-to-br from-red-600 to-red-500 p-6 text-white shadow-lg z-10">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <UIcon name="i-heroicons-clock" class="text-2xl text-white" />
              </div>
              <h2 class="text-xl font-bold">ประวัติการแลก</h2>
            </div>
            <button
              @click="toggleHistory"
              class="p-2 rounded-lg hover:bg-white/20 transition-all"
              aria-label="ปิด"
            >
              <UIcon name="i-heroicons-x-mark" class="text-2xl text-white" />
            </button>
          </div>

          <!-- Current Points Summary -->
          <div class="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <p class="text-white/80 text-sm mb-1">คะแนนปัจจุบัน</p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-black text-white">{{ redeemHistory.current_point || memberCups.current }}</span>
              <span class="text-sm text-white/90">คะแนน</span>
            </div>
            <p class="text-white/70 text-xs mt-2">
              ทั้งหมด {{ redeemHistory.total_transactions }} รายการ
            </p>
          </div>
        </div>

        <!-- History Content -->
        <div class="p-4">
          <!-- Loading State -->
          <div v-if="isLoadingHistory" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            <p class="text-gray-600 mt-4">กำลังโหลดข้อมูล...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="!redeemHistory.transactions || redeemHistory.transactions.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📜</div>
            <p class="text-gray-600 font-medium">ยังไม่มีประวัติการแลกรางวัล</p>
            <p class="text-gray-400 text-sm mt-2">เมื่อคุณแลกรางวัล ประวัติจะแสดงที่นี่</p>
          </div>

          <!-- Transaction List -->
          <div v-else class="space-y-3">
            <div
              v-for="transaction in redeemHistory.transactions"
              :key="transaction.id"
              class="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <!-- Transaction Header -->
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span class="text-xl">🎁</span>
                  </div>
                  <div>
                    <p class="font-bold text-gray-800">แลกรางวัล</p>
                    <p class="text-xs text-gray-500">รหัส #{{ transaction.id }}</p>
                  </div>
                </div>
                <span
                  :class="['text-xs font-bold px-3 py-1 rounded-full', getStatusColor(transaction.status)]"
                >
                  {{ transaction.status_text }}
                </span>
              </div>

              <!-- Points Used -->
              <div class="bg-gray-50 rounded-lg p-3 mb-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">คะแนนที่ใช้</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-xl font-black text-red-600">-{{ transaction.point_used }}</span>
                    <span class="text-sm text-gray-600">คะแนน</span>
                  </div>
                </div>
              </div>

              <!-- Date -->
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <UIcon name="i-heroicons-calendar" class="text-sm" />
                <span>{{ formatDate(transaction.redeemed_at) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- History Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t p-4 text-center">
          <p class="text-xs text-gray-500">
            รายการแสดงเรียงตามวันที่ล่าสุด
          </p>
        </div>
      </div>
    </Transition>
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

/* Smooth menu animation */
nav ul li a {
  transition: all 0.2s ease;
}

nav ul li a:active {
  transform: scale(0.98);
}

/* Shimmer effect for redeemable badge */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.shimmer {
  animation: shimmer 3s infinite;
}

/* Pulse glow animation */
@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(250, 204, 21, 0.5), 0 0 40px rgba(250, 204, 21, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 30px rgba(250, 204, 21, 0.8), 0 0 60px rgba(250, 204, 21, 0.5);
    transform: scale(1.05);
  }
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
</style>
