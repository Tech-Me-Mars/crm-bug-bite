<script setup>
import { ref } from 'vue'

// Disable default layout for this page
definePageMeta({
  layout: false,
  middleware: 'auth' // Require authentication
})

const config = useRuntimeConfig()

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

// Get user data from localStorage
const getUserData = () => {
  if (import.meta.client) {
    const userInfo = localStorage.getItem('user_info')
    const customerData = localStorage.getItem('customer_data')

    if (userInfo && customerData) {
      const user = JSON.parse(userInfo)
      const customer = JSON.parse(customerData)

      return {
        fullName: customer.fullname || user.displayName || 'ไม่ระบุ',
        phoneNumber: customer.phone_no || 'ไม่ระบุ',
        pictureUrl: user.pictureUrl || '',
        userId: user.userId || '',
        displayName: user.displayName || '',
        accumulatedCups: Number(customer.point || user.point || '0'), // Point = แก้วสะสม
        memberSince: customer.created_at || user.created_at || null, // สมาชิกตั้งแต่
        totalOrders: 23 // TODO: Get from API
      }
    }
  }

  return {
    fullName: 'ไม่ระบุ',
    phoneNumber: 'ไม่ระบุ',
    pictureUrl: '',
    userId: '',
    displayName: '',
    accumulatedCups: 0, // Point = แก้วสะสม
    memberSince: null,
    totalOrders: 0
  }
}

// User profile data
const userProfile = ref(getUserData())

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error' | 'warning'
})

const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type
  }
  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Fetch accumulated cups (point) from API
const fetchAccumulatedCups = async () => {
  try {
    const api = useApi()
    const response = await api.post('/crmbugbite/v1/point', {
      userId: userProfile.value.userId
    })

    if (response.data.status === true) {
      userProfile.value.accumulatedCups = Number(response.data.data.point || '0')
    }
  } catch (error) {
    console.error('Error fetching accumulated cups:', error)
  }
}

// Fetch order count from API
const fetchOrderCount = async () => {
  try {
    const api = useApi()
    const response = await api.post('/crmbugbite/v1/order/count', {
      userId: userProfile.value.userId
    })

    if (response.data.status === true) {
      userProfile.value.totalOrders = response.data.data.order_count || 0
    }
  } catch (error) {
    console.error('Error fetching order count:', error)
  }
}

// Refresh profile data
const refreshProfile = () => {
  userProfile.value = getUserData()
  fetchAccumulatedCups() // Fetch accumulated cups after refresh
  fetchOrderCount() // Fetch order count after refresh
}

// Fetch data on mount
onMounted(() => {
  fetchAccumulatedCups()
  fetchOrderCount()
})

// Edit profile modal
const isEditModalOpen = ref(false)
const editForm = ref({
  fullName: '',
  phoneNumber: ''
})
const isSaving = ref(false)

// Open edit modal
const openEditModal = () => {
  editForm.value = {
    fullName: userProfile.value.fullName,
    phoneNumber: userProfile.value.phoneNumber
  }
  isEditModalOpen.value = true
}

// Close edit modal
const closeEditModal = () => {
  isEditModalOpen.value = false
}

// Save profile changes
const saveProfile = async () => {
  if (!editForm.value.fullName.trim()) {
    showToast('กรุณากรอกชื่อ-นามสกุล', 'warning')
    return
  }

  isSaving.value = true
  try {
    const api = useApi()

    // Call API to update profile
    const response = await api.post('/crmbugbite/v1/profile/update', {
      userId: userProfile.value.userId,
      fullname: editForm.value.fullName
    })

    // Check response status
    if (response.data.status === true) {
      // Update localStorage
      if (import.meta.client) {
        const customerData = JSON.parse(localStorage.getItem('customer_data') || '{}')
        customerData.fullname = response.data.data.fullname
        localStorage.setItem('customer_data', JSON.stringify(customerData))

        const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
        userInfo.fullname = response.data.data.fullname
        localStorage.setItem('user_info', JSON.stringify(userInfo))
      }

      // Refresh profile data
      refreshProfile()

      // Close modal
      closeEditModal()

      showToast(response.data.message || 'บันทึกข้อมูลสำเร็จ', 'success')
    } else {
      showToast('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error')
    }
  } catch (error) {
    console.error('Error saving profile:', error)
    showToast(error.response?.data?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error')
  } finally {
    isSaving.value = false
  }
}

// Handle logout
const handleLogout = () => {
  if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
    // Clear all data from localStorage
    if (import.meta.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('user_info')
      localStorage.removeItem('customer_data')
      localStorage.removeItem('line_profile')
    }
    console.log('Logging out...')
    navigateTo('/', { replace: true })
  }
}

// Format date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
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

    <!-- Profile Content -->
    <UContainer class="py-6">
      <div class="max-w-2xl mx-auto">
        <!-- Page Title -->
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800">โปรไฟล์ของฉัน</h1>
        </div>

        <!-- Profile Card -->
        <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <!-- Profile Header -->
          <div class="bg-gradient-to-r from-red-500 to-red-600 p-6 text-center">
            <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg overflow-hidden">
              <img
                v-if="userProfile.pictureUrl"
                :src="userProfile.pictureUrl"
                :alt="userProfile.fullName"
                class="w-full h-full object-cover"
              >
              <span v-else class="text-5xl">👤</span>
            </div>
            <h2 class="text-2xl font-bold text-white mb-1">
              {{ userProfile.fullName }}
            </h2>
            <p v-if="userProfile.memberSince" class="text-white/90 text-sm">
              สมาชิกตั้งแต่ {{ formatDate(userProfile.memberSince) }}
            </p>
          </div>

          <!-- Profile Info -->
          <div class="p-6 space-y-4">
            <!-- Phone Number -->
            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-2xl">📱</span>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">เบอร์โทรศัพท์</p>
                <p class="text-lg font-semibold text-gray-800">
                  {{ userProfile.phoneNumber }}
                </p>
              </div>
            </div>

            <!-- Accumulated Cups (จาก point) -->
            <div class="flex items-center gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
              <div class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-2xl">🥤</span>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-600 mb-1">แก้วสะสม</p>
                <div class="flex items-baseline gap-2">
                  <p class="text-3xl font-black text-red-600">
                    {{ userProfile.accumulatedCups }}
                  </p>
                  <p class="text-sm text-gray-600">/ 10 แก้ว</p>
                </div>
                <div class="mt-2 bg-white/50 rounded-full h-2 overflow-hidden">
                  <div
                    class="bg-red-500 h-full rounded-full transition-all"
                    :style="{ width: `${(userProfile.accumulatedCups / 10) * 100}%` }"
                  />
                </div>
              </div>
            </div>

            <!-- Total Orders -->
            <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span class="text-2xl">📦</span>
              </div>
              <div class="flex-1">
                <p class="text-xs text-gray-500 mb-1">ยอดสั่งซื้อทั้งหมด</p>
                <p class="text-lg font-semibold text-gray-800">
                  {{ userProfile.totalOrders }} ครั้ง
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <!-- Edit Profile Button -->
          <button
            type="button"
            class="w-full bg-white text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center border-2 border-gray-200 hover:border-red-500"
            @click="openEditModal"
          >
            ✏️ แก้ไขข้อมูลส่วนตัว
          </button>

          <!-- Order History Button -->
          <NuxtLink
            to="/orders"
            class="block w-full bg-white text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center border-2 border-gray-200 hover:border-red-500"
          >
            📋 ประวัติการสั่งซื้อ
          </NuxtLink>

          <!-- Logout Button -->
          <button
            type="button"
            class="w-full bg-red-50 text-red-600 font-semibold py-4 px-6 rounded-xl shadow-md hover:bg-red-100 transition-all duration-200 border-2 border-red-200"
            @click="handleLogout"
          >
            🚪 ออกจากระบบ
          </button>
        </div>

        <!-- Additional Info -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย
          </p>
        </div>
      </div>
    </UContainer>

    <!-- Bottom Navigation Footer -->
    <BugBiteFooter />

    <!-- Edit Profile Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isEditModalOpen"
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        @click.self="closeEditModal"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold">แก้ไขข้อมูลส่วนตัว</h3>
              <button
                type="button"
                class="text-white/80 hover:text-white"
                @click="closeEditModal"
              >
                <span class="text-2xl">×</span>
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4">
            <!-- Full Name Field (Editable) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-นามสกุล <span class="text-red-500">*</span>
              </label>
              <input
                v-model="editForm.fullName"
                type="text"
                class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
                placeholder="กรอกชื่อ-นามสกุล"
              >
            </div>

            <!-- Phone Number Field (Readonly) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                เบอร์โทรศัพท์
              </label>
              <input
                v-model="editForm.phoneNumber"
                type="text"
                readonly
                class="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
              >
              <p class="text-xs text-gray-500 mt-1">
                ไม่สามารถแก้ไขเบอร์โทรศัพท์ได้
              </p>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-6 bg-gray-50 flex gap-3">
            <button
              type="button"
              class="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
              @click="closeEditModal"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSaving"
              @click="saveProfile"
            >
              {{ isSaving ? 'กำลังบันทึก...' : 'บันทึก' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

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

    <!-- Toast Notification -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="toast.show"
        class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md px-4"
      >
        <div
          :class="[
            'rounded-xl shadow-2xl p-4 flex items-center gap-3',
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-white'
          ]"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <span v-if="toast.type === 'success'" class="text-2xl">✓</span>
            <span v-else-if="toast.type === 'error'" class="text-2xl">✕</span>
            <span v-else class="text-2xl">⚠</span>
          </div>

          <!-- Message -->
          <div class="flex-1 font-medium">
            {{ toast.message }}
          </div>

          <!-- Close Button -->
          <button
            type="button"
            class="flex-shrink-0 text-white/80 hover:text-white"
            @click="toast.show = false"
          >
            <span class="text-xl">×</span>
          </button>
        </div>
      </div>
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
a,
button {
  transition: all 0.3s ease;
}

a:active,
button:active {
  transform: scale(0.98);
}

/* Hover effects */
a:hover,
button:hover {
  transform: translateY(-2px);
}
</style>
