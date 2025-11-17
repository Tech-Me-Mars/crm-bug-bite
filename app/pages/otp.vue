<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Disable default layout for this page
definePageMeta({
  layout: false
})

// Get phone number from query params
const route = useRoute()
const phoneNumber = ref(route.query.phone || '0XX-XXX-XXXX')

// OTP inputs (6 digits)
const otpDigits = ref(['', '', '', '', '', ''])
const otpInputRefs = ref([])

// Timer for resend OTP
const resendTimer = ref(60)
const canResend = computed(() => resendTimer.value === 0)

// Loading states
const isVerifying = ref(false)
const isResending = ref(false)

// Error message
const errorMessage = ref('')

// Timer interval
let timerInterval = null

// Start countdown timer
const startTimer = () => {
  resendTimer.value = 60
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

// Handle OTP input
const handleOtpInput = (index, event) => {
  const value = event.target.value

  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    event.target.value = otpDigits.value[index]
    return
  }

  otpDigits.value[index] = value

  // Auto-focus next input
  if (value && index < 5) {
    otpInputRefs.value[index + 1]?.focus()
  }

  // Clear error when user types
  errorMessage.value = ''
}

// Handle backspace
const handleKeydown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpInputRefs.value[index - 1]?.focus()
  }
}

// Handle paste
const handlePaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '')

  for (let i = 0; i < Math.min(pastedData.length, 6); i++) {
    otpDigits.value[i] = pastedData[i]
  }

  // Focus last filled input or last input
  const lastIndex = Math.min(pastedData.length, 5)
  otpInputRefs.value[lastIndex]?.focus()
}

// Get full OTP code
const getOtpCode = () => {
  return otpDigits.value.join('')
}

// Verify OTP
const handleVerify = async () => {
  const otpCode = getOtpCode()

  if (otpCode.length !== 6) {
    errorMessage.value = 'กรุณากรอก OTP ให้ครบ 6 หลัก'
    return
  }

  isVerifying.value = true
  errorMessage.value = ''

  try {
    // TODO: Replace with actual API call
    // const response = await request('POST', '/api/verify-otp', { phone: phoneNumber.value, otp: otpCode }, false)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Mock verification (in real app, check response from API)
    if (otpCode === '123456') {
      console.log('OTP verified:', otpCode)
      alert('ยืนยัน OTP สำเร็จ!')
      navigateTo('/member')
    } else {
      errorMessage.value = 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
      otpDigits.value = ['', '', '', '', '', '']
      otpInputRefs.value[0]?.focus()
    }
  } catch (error) {
    console.error('OTP verification error:', error)
    errorMessage.value = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
  } finally {
    isVerifying.value = false
  }
}

// Resend OTP
const handleResend = async () => {
  if (!canResend.value) return

  isResending.value = true

  try {
    // TODO: Replace with actual API call
    // const response = await request('POST', '/api/resend-otp', { phone: phoneNumber.value }, false)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('OTP resent to:', phoneNumber.value)
    alert('ส่ง OTP ใหม่แล้ว กรุณาตรวจสอบข้อความ')
    startTimer()
    otpDigits.value = ['', '', '', '', '', '']
    otpInputRefs.value[0]?.focus()
  } catch (error) {
    console.error('Resend OTP error:', error)
    alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
  } finally {
    isResending.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  startTimer()
  // Focus first input
  setTimeout(() => {
    otpInputRefs.value[0]?.focus()
  }, 300)
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
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

    <!-- OTP Verification Form -->
    <UContainer class="py-6">
      <div class="max-w-md mx-auto">
        <!-- Page Title -->
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-2">ยืนยันรหัส OTP</h1>
          <p class="text-sm text-gray-600">
            กรุณากรอกรหัส OTP 6 หลักที่ส่งไปยัง
          </p>
          <p class="text-sm font-semibold text-red-600 mt-1">
            {{ phoneNumber }}
          </p>
        </div>

        <!-- OTP Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <!-- OTP Input Fields -->
          <div class="flex justify-center gap-3 mb-6">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => otpInputRefs[index] = el"
              v-model="otpDigits[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              :class="errorMessage ? 'border-red-500' : 'border-gray-300'"
              @input="handleOtpInput(index, $event)"
              @keydown="handleKeydown(index, $event)"
              @paste="index === 0 ? handlePaste($event) : null"
            >
          </div>

          <!-- Error Message -->
          <p v-if="errorMessage" class="text-center text-sm text-red-500 mb-4">
            {{ errorMessage }}
          </p>

          <!-- Verify Button -->
          <button
            type="button"
            :disabled="isVerifying || getOtpCode().length !== 6"
            class="verify-button w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200 mb-4"
            @click="handleVerify"
          >
            <span v-if="!isVerifying">ยืนยัน OTP</span>
            <span v-else class="flex items-center justify-center gap-2">
              <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              กำลังตรวจสอบ...
            </span>
          </button>

          <!-- Resend OTP Section -->
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">
              ไม่ได้รับรหัส OTP?
            </p>
            <button
              type="button"
              :disabled="!canResend || isResending"
              class="text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="canResend ? 'text-red-600 hover:text-red-700' : 'text-gray-400'"
              @click="handleResend"
            >
              <span v-if="!isResending">
                {{ canResend ? 'ส่ง OTP อีกครั้ง' : `ส่งอีกครั้งใน ${resendTimer} วินาที` }}
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600" />
                กำลังส่ง...
              </span>
            </button>
          </div>

          <!-- Back Link -->
          <div class="text-center mt-6">
            <NuxtLink
              to="/register"
              class="text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              ← กลับไปแก้ไขเบอร์โทร
            </NuxtLink>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            💡 เคล็ดลับ: สำหรับการทดสอบ ใช้รหัส OTP: <span class="font-mono font-bold">123456</span>
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

/* Verify Button Styling */
.verify-button {
  background: linear-gradient(to right, #ef4444, #dc2626);
  border: none;
  cursor: pointer;
}

.verify-button:hover:not(:disabled) {
  background: linear-gradient(to right, #dc2626, #b91c1c);
  box-shadow: 0 10px 25px rgba(220, 38, 38, 0.3);
  transform: translateY(-2px);
}

.verify-button:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.verify-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: linear-gradient(to right, #9ca3af, #6b7280);
}

/* OTP Input Focus Effect */
input:focus {
  outline: none;
  transform: scale(1.05);
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

/* Pulse animation for error */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

input.border-red-500 {
  animation: shake 0.3s ease;
}
</style>
