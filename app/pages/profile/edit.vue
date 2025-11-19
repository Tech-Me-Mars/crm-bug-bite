<script setup>
import { ref, computed } from 'vue'

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

// Form data (load from current user profile)
const formData = ref({
  fullName: 'สมชาย ใจดี',
  phoneNumber: '081-234-5678'
})

// Original data for comparison
const originalData = ref({
  fullName: 'สมชาย ใจดี',
  phoneNumber: '081-234-5678'
})

// Form validation errors
const errors = ref({
  fullName: '',
  phoneNumber: ''
})

// Loading state
const isSaving = ref(false)

// Check if form has changes
const hasChanges = computed(() => {
  return formData.value.fullName !== originalData.value.fullName ||
         formData.value.phoneNumber !== originalData.value.phoneNumber
})

// Validate form
const validateForm = () => {
  let isValid = true
  errors.value = {
    fullName: '',
    phoneNumber: ''
  }

  // Validate full name
  if (!formData.value.fullName.trim()) {
    errors.value.fullName = 'กรุณากรอกชื่อ-นามสกุล'
    isValid = false
  } else if (formData.value.fullName.trim().length < 3) {
    errors.value.fullName = 'ชื่อ-นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร'
    isValid = false
  }

  // Validate phone number
  if (!formData.value.phoneNumber.trim()) {
    errors.value.phoneNumber = 'กรุณากรอกเบอร์โทรศัพท์'
    isValid = false
  } else if (!/^[0-9]{10}$/.test(formData.value.phoneNumber.replace(/-/g, ''))) {
    errors.value.phoneNumber = 'เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก'
    isValid = false
  }

  return isValid
}

// Handle form submission
const handleSave = async () => {
  if (!validateForm()) {
    return
  }

  isSaving.value = true

  try {
    // TODO: Replace with actual API call
    // const response = await request('PUT', '/api/profile', formData.value, true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Updated profile data:', formData.value)

    // Update original data
    originalData.value = { ...formData.value }

    // Show success message and redirect
    alert('บันทึกข้อมูลสำเร็จ!')
    navigateTo('/profile')
  } catch (error) {
    console.error('Update profile error:', error)
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
  } finally {
    isSaving.value = false
  }
}

// Handle cancel
const handleCancel = () => {
  if (hasChanges.value) {
    if (confirm('คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการยกเลิกหรือไม่?')) {
      navigateTo('/profile')
    }
  } else {
    navigateTo('/profile')
  }
}

// Format phone number with dashes
const formatPhoneNumber = (value) => {
  const cleaned = value.replace(/\D/g, '')
  const limited = cleaned.substring(0, 10)

  if (limited.length <= 3) {
    return limited
  } else if (limited.length <= 6) {
    return `${limited.slice(0, 3)}-${limited.slice(3)}`
  } else {
    return `${limited.slice(0, 3)}-${limited.slice(3, 6)}-${limited.slice(6)}`
  }
}

// Handle phone input
const handlePhoneInput = (event) => {
  formData.value.phoneNumber = formatPhoneNumber(event.target.value)
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

    <!-- Edit Profile Form -->
    <UContainer class="py-6">
      <div class="max-w-md mx-auto">
        <!-- Page Title -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">แก้ไขข้อมูลส่วนตัว</h1>
          <p class="text-sm text-gray-600">อัพเดทข้อมูลของคุณ</p>
        </div>

        <!-- Edit Form Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <form class="space-y-6" @submit.prevent="handleSave">
            <!-- Full Name Input -->
            <div>
              <label for="fullName" class="block text-sm font-semibold text-gray-700 mb-2">
                ชื่อ - นามสกุล <span class="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                v-model="formData.fullName"
                type="text"
                placeholder="กรอกชื่อ-นามสกุล"
                class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                :class="errors.fullName ? 'border-red-500' : 'border-gray-300'"
              >
              <p v-if="errors.fullName" class="mt-1 text-xs text-red-500">
                {{ errors.fullName }}
              </p>
            </div>

            <!-- Phone Number Input -->
            <div>
              <label for="phoneNumber" class="block text-sm font-semibold text-gray-700 mb-2">
                เบอร์โทรศัพท์ <span class="text-red-500">*</span>
              </label>
              <input
                id="phoneNumber"
                v-model="formData.phoneNumber"
                type="tel"
                placeholder="0XX-XXX-XXXX"
                maxlength="12"
                class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                :class="errors.phoneNumber ? 'border-red-500' : 'border-gray-300'"
                @input="handlePhoneInput"
              >
              <p v-if="errors.phoneNumber" class="mt-1 text-xs text-red-500">
                {{ errors.phoneNumber }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <!-- Cancel Button -->
              <button
                type="button"
                class="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-xl shadow-md hover:bg-gray-200 transition-all duration-200"
                @click="handleCancel"
              >
                ยกเลิก
              </button>

              <!-- Save Button -->
              <button
                type="submit"
                :disabled="isSaving || !hasChanges"
                class="save-button flex-1 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200"
              >
                <span v-if="!isSaving">บันทึก</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  กำลังบันทึก...
                </span>
              </button>
            </div>
          </form>
        </div>

        <!-- Info Note -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            💡 การเปลี่ยนเบอร์โทรศัพท์อาจต้องยืนยัน OTP
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

/* Save Button Styling */
.save-button {
  background: linear-gradient(to right, #ef4444, #dc2626);
  border: none;
  cursor: pointer;
}

.save-button:hover:not(:disabled) {
  background: linear-gradient(to right, #dc2626, #b91c1c);
  box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
  transform: translateY(-2px);
}

.save-button:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.save-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: linear-gradient(to right, #9ca3af, #6b7280);
}

/* Focus effects */
input:focus {
  outline: none;
}

/* Animation for spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions */
button {
  transition: all 0.3s ease;
}

/* Input animations */
input {
  transition: all 0.2s ease;
}

input:hover:not(:focus) {
  border-color: #fca5a5;
}
</style>
