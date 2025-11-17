<script setup>
import { ref } from 'vue'

// Disable default layout for this page
definePageMeta({
  layout: false
})

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

// User profile data (พร้อมรับข้อมูลจาก API)
const userProfile = ref({
  fullName: 'สมชาย ใจดี',
  phoneNumber: '081-234-5678',
  accumulatedCups: 8,
  memberSince: '2024-01-15',
  totalOrders: 23
})

// Loading state
const isLoading = ref(false)

// Fetch user profile from API
const _fetchUserProfile = async () => {
  isLoading.value = true
  try {
    // TODO: Replace with actual API call
    // const response = await request('GET', '/api/profile', null, true)
    // userProfile.value = response.data
    console.log('Fetched user profile')
  } catch (error) {
    console.error('Error fetching user profile:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle logout
const handleLogout = () => {
  if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
    // TODO: Clear user session
    console.log('Logging out...')
    navigateTo('/')
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
            <div class="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
              <span class="text-5xl">👤</span>
            </div>
            <h2 class="text-2xl font-bold text-white mb-1">
              {{ userProfile.fullName }}
            </h2>
            <p class="text-white/90 text-sm">
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

            <!-- Accumulated Cups -->
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
          <NuxtLink
            to="/profile/edit"
            class="block w-full bg-white text-gray-800 font-semibold py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-center border-2 border-gray-200 hover:border-red-500"
          >
            ✏️ แก้ไขข้อมูลส่วนตัว
          </NuxtLink>

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
            <p class="text-sm text-gray-600">เปิดทุกวัน 10:00 - 20:00</p>
            <p class="text-xs text-gray-500">โทร: 02-XXX-XXXX</p>
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
