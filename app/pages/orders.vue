<script setup>
import { ref, computed } from 'vue'

// Disable default layout for this page
definePageMeta({
  layout: false,
  middleware: 'auth' // Require authentication
})

const config = useRuntimeConfig()
const api = useApi()

// Menu state
const isMenuOpen = ref(false)

const menuItems = [
  { label: 'หน้าแรก', icon: 'i-heroicons-home', route: '/' },
  { label: 'สมาชิก', icon: 'i-heroicons-user-group', route: '/profile' },
  { label: 'ติดต่อเรา', icon: 'i-heroicons-phone', route: '/contact' }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

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

// Order history data
const orders = ref([])
const summary = ref({
  total_orders: 0,
  total_items: 0,
  total_amount: 0
})

// Loading state
const isLoading = ref(false)

// Filtered orders (ตอนนี้แสดงทั้งหมด)
const filteredOrders = computed(() => orders.value)

// Total stats from API
const totalOrders = computed(() => summary.value.total_orders)
const totalItems = computed(() => summary.value.total_items)

// Format date
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

// Get status text and color
const getStatusInfo = (status) => {
  const statusMap = {
    0: { text: 'รอดำเนินการ', color: 'bg-yellow-100 text-yellow-700' },
    1: { text: 'สำเร็จ', color: 'bg-green-100 text-green-700' },
    2: { text: 'ยกเลิก', color: 'bg-red-100 text-red-700' }
  }
  return statusMap[status] || statusMap[1]
}

// Fetch orders from API
const fetchOrders = async () => {
  try {
    if (!userId.value) return

    isLoading.value = true

    const response = await api.post('/crmbugbite/v1/order/history', {
      userId: userId.value
    })

    if (response.data.status === true) {
      summary.value = response.data.data.summary || {
        total_orders: 0,
        total_items: 0,
        total_amount: 0
      }
      orders.value = response.data.data.orders || []
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    isLoading.value = false
  }
}

// Initialize on mount
onMounted(() => {
  getUserId()
  fetchOrders()
})
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Simple Header (Logo Only) -->
    <div class="bg-gradient-to-br from-red-600 via-red-500 to-red-600 relative pb-8">
      <!-- Hamburger Menu Button -->
      <div class="absolute top-4 right-4 z-50">
        <button
          class="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
          aria-label="Toggle menu"
          @click="toggleMenu"
        >
          <div class="w-6 h-5 flex flex-col justify-between">
            <span
              :class="[
                'block h-0.5 bg-white transition-all',
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              ]"
            />
            <span
              :class="[
                'block h-0.5 bg-white transition-all',
                isMenuOpen ? 'opacity-0' : ''
              ]"
            />
            <span
              :class="[
                'block h-0.5 bg-white transition-all',
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              ]"
            />
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
                >
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
      <div class="h-12" />

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

    <!-- Order History Content -->
    <UContainer class="py-6 pb-24">
      <div class="max-w-2xl mx-auto">
        <!-- Page Title -->
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">ประวัติการสั่งซื้อ</h1>
          <p class="text-sm text-gray-600">ดูรายการสั่งซื้อทั้งหมดของคุณ</p>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 gap-3 mb-6">
          <!-- Total Orders -->
          <div class="bg-white rounded-xl p-4 shadow-md text-center">
            <p class="text-2xl font-bold text-red-600">{{ totalOrders }}</p>
            <p class="text-xs text-gray-600 mt-1">คำสั่งซื้อ</p>
          </div>

          <!-- Total Items -->
          <div class="bg-white rounded-xl p-4 shadow-md text-center">
            <p class="text-2xl font-bold text-orange-600">{{ totalItems }}</p>
            <p class="text-xs text-gray-600 mt-1">รายการ</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600" />
        </div>

        <!-- Orders List -->
        <div v-else class="space-y-4">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
          >
            <!-- Order Header -->
            <div class="bg-gradient-to-r from-red-50 to-orange-50 p-4 border-b border-red-100">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-semibold text-gray-800">{{ order.sale_number }}</p>
                  <p class="text-xs text-gray-600 mt-1">{{ formatDate(order.sale_date) }}</p>
                </div>
                <span
                  class="px-3 py-1 rounded-full text-xs font-semibold"
                  :class="getStatusInfo(order.status).color"
                >
                  {{ getStatusInfo(order.status).text }}
                </span>
              </div>
            </div>

            <!-- Order Items -->
            <div class="p-4">
              <div class="space-y-2">
                <div
                  v-for="(item, idx) in order.sale_details"
                  :key="idx"
                  class="text-sm"
                >
                  <span class="text-gray-700">
                    {{ item.product_name }} x{{ item.qty }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredOrders.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">📦</div>
            <p class="text-gray-600 font-semibold mb-2">ยังไม่มีประวัติการสั่งซื้อ</p>
            <p class="text-sm text-gray-500 mb-6">เริ่มสั่งซื้อเพื่อสะสมแก้วกันเลย!</p>
            <NuxtLink
              to="/member"
              class="inline-block bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              ดูเมนู
            </NuxtLink>
          </div>
        </div>

        <!-- Back Button -->
        <div class="mt-6 text-center">
          <NuxtLink
            to="/profile"
            class="text-sm text-gray-600 hover:text-red-600 transition-colors"
          >
            ← กลับโปรไฟล์
          </NuxtLink>
        </div>
      </div>
    </UContainer>

    <!-- Bottom Navigation Footer -->
    <BugBiteFooter />

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
              >
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
                class="flex items-center gap-3 p-4 rounded-lg hover:bg-gray-100 transition-colors group"
                @click="navigateTo(item.route)"
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
        v-if="isMenuOpen"
        class="fixed inset-0 bg-black/50 z-30"
        @click="toggleMenu"
      />
    </Transition>
  </div>
</template>

<style scoped>
/* Bug Bite Text Styling */
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

/* Smooth transitions */
.hover\:shadow-lg {
  transition: all 0.3s ease;
}
</style>
