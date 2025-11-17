<script setup>
import { ref } from 'vue'

// Disable default layout for this page
definePageMeta({
  layout: false
})

// Form data
const formData = ref({
  fullName: '',
  phoneNumber: ''
})

// Form validation errors
const errors = ref({
  fullName: '',
  phoneNumber: ''
})

// Loading state
const isSubmitting = ref(false)

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
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // TODO: Replace with actual API call
    // const response = await request('POST', '/api/register', formData.value, false)

    // Simulate API call (sending OTP)
    await new Promise(resolve => setTimeout(resolve, 1500))

    console.log('Registration data:', formData.value)
    console.log('Sending OTP to:', formData.value.phoneNumber)

    // Navigate to OTP verification page
    navigateTo(`/otp?phone=${formData.value.phoneNumber}`)
  } catch (error) {
    console.error('Registration error:', error)
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
  } finally {
    isSubmitting.value = false
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

    <!-- Registration Form -->
    <UContainer class="py-6">
      <div class="max-w-md mx-auto">
        <!-- Page Title -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">ลงทะเบียนสมาชิก</h1>
          <p class="text-sm text-gray-600">กรอกข้อมูลเพื่อเป็นสมาชิก Bug Bite</p>
        </div>

        <!-- Registration Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <form class="space-y-6" @submit.prevent="handleSubmit">
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
              <p class="mt-1 text-xs text-gray-500">
                ตัวอย่าง: 081-234-5678
              </p>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="register-button w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200"
            >
              <span v-if="!isSubmitting">ลงทะเบียน</span>
              <span v-else class="flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                กำลังดำเนินการ...
              </span>
            </button>

            <!-- Back to Home Link -->
            <div class="text-center">
              <NuxtLink
                to="/"
                class="text-sm text-gray-600 hover:text-red-600 transition-colors"
              >
                ← กลับหน้าแรก
              </NuxtLink>
            </div>
          </form>
        </div>

        <!-- Additional Info -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            เมื่อลงทะเบียน คุณจะได้รับสิทธิพิเศษและสะสมแก้วเพื่อแลกรางวัล
          </p>
        </div>
      </div>
    </UContainer>
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

/* Register Button Styling */
.register-button {
  background: linear-gradient(to right, #ef4444, #dc2626);
  border: none;
  cursor: pointer;
}

.register-button:hover:not(:disabled) {
  background: linear-gradient(to right, #dc2626, #b91c1c);
  box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
  transform: translateY(-2px);
}

.register-button:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.register-button:disabled {
  opacity: 0.6;
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
