<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const menuItems = [
  { label: 'หน้าแรก', icon: 'i-heroicons-home', route: '/' },
  { label: 'สมาชิก', icon: 'i-heroicons-user-group', route: '/profile' },
  { label: 'ติดต่อเรา', icon: 'i-heroicons-phone', route: '/contact' }
]

// Member Cups Data (พร้อมรับข้อมูลจาก API)
const memberCups = ref({
  current: 10, // จำนวนแก้วปัจจุบัน
  target: 10  // เป้าหมาย 10 แก้ว
})

// Check if member can redeem (ครบ 10 แก้ว)
const canRedeem = computed(() => memberCups.value.current >= memberCups.value.target)

// Fetch member cups from API
const _fetchMemberCups = async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await request('GET', '/api/member/cups', null, true)
    // memberCups.value = response.data
    console.log('Fetched member cups')
  } catch (error) {
    console.error('Error fetching member cups:', error)
  }
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const _handleNavigate = (route) => {
  isMenuOpen.value = false
  navigateTo(route)
}
</script>

<template>
  <div class="relative">
    <!-- Red Header Section -->
    <div class="bg-gradient-to-br from-red-600 via-red-500 to-red-600 relative pb-8">
      <!-- Hamburger Menu Button -->
      <div class="absolute top-4 right-4 z-50">
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
                <!-- Success Badge -->
                <div
                  v-if="canRedeem"
                  class="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse"
                >
                  ✓ แลกได้
                </div>
                <NuxtLink
                  to="/member/points"
                  class="text-white/90 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
                >
                  รายละเอียด
                  <span class="text-lg">›</span>
                </NuxtLink>
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
        @click="toggleMenu"
        class="fixed inset-0 bg-black/50 z-30"
      ></div>
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
</style>
