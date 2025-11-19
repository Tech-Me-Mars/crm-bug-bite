<script setup>
import { ref } from 'vue'

// Disable default layout for this page
definePageMeta({
  layout: false
})

const api = useApi()

// Current step (1 = enter info, 2 = verify OTP)
const currentStep = ref(1)

// Form data
const formData = ref({
  fullName: '',
  phoneNumber: '',
  userId: ''
})

// OTP data
const otpCode = ref('')
const otpError = ref('')
const refCode = ref('') // OTP reference code
const otpDigits = ref(['', '', '', '', '', '']) // 6 separate OTP digits

// Form validation errors
const errors = ref({
  fullName: '',
  phoneNumber: ''
})

// Loading states
const isSendingOtp = ref(false)
const isVerifying = ref(false)

// Toast notification
const toast = ref({
  show: false,
  message: '',
  type: 'success' // 'success' | 'error' | 'info'
})

const showToast = (message, type = 'success') => {
  toast.value = {
    show: true,
    message,
    type
  }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Get userId from LINE profile
const getUserId = () => {
  if (import.meta.client) {
    const lineProfile = localStorage.getItem('line_profile')
    if (lineProfile) {
      const profile = JSON.parse(lineProfile)
      formData.value.userId = profile.userId || ''
    }
  }
}

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

// Step 1: Send OTP
const handleSendOtp = async () => {
  if (!validateForm()) {
    return
  }

  isSendingOtp.value = true

  try {
    // Remove dashes from phone number (keep format: 0869445500)
    const phoneClean = formData.value.phoneNumber.replace(/-/g, '')

    // Call send OTP API
    const response = await api.post('/auth/otp/send', {
      phone_no: phoneClean
    })

    console.log('OTP Response:', response.data)

    if (response.data.status === true) {
      // Save reference code
      refCode.value = response.data.data.ref_code || ''

      // Move to step 2 (OTP verification)
      currentStep.value = 2

      // Show success message with ref code
      if (refCode.value) {
        showToast(`ส่ง OTP สำเร็จ\nรหัสอ้างอิง: ${refCode.value}`, 'success')
      }
    } else {
      showToast('เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง', 'error')
    }
  } catch (error) {
    console.error('Send OTP error:', error)
    showToast(error.response?.data?.message || 'เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง', 'error')
  } finally {
    isSendingOtp.value = false
  }
}

// Step 2: Verify OTP and Register
const handleVerifyOtp = async () => {
  if (!otpCode.value || otpCode.value.length !== 6) {
    otpError.value = 'กรุณากรอก OTP 6 หลัก'
    return
  }

  isVerifying.value = true
  otpError.value = ''

  try {
    // Remove dashes from phone number (keep format: 0869445500)
    const phoneClean = formData.value.phoneNumber.replace(/-/g, '')

    // Call verify OTP and register API
    const response = await api.post('/auth/otp/verify', {
      phone_no: phoneClean,
      otp: otpCode.value,
      ref_code: refCode.value,
      userId: formData.value.userId,
      fullname: formData.value.fullName
    })

    console.log('Verify Response:', response.data)

    if (response.data.status === true) {
      // Save data to localStorage (similar to index.vue)
      if (import.meta.client) {
        // Get LINE profile for picture
        const lineProfile = localStorage.getItem('line_profile')
        let pictureUrl = ''
        let displayName = response.data.data.fullname

        if (lineProfile) {
          const profile = JSON.parse(lineProfile)
          pictureUrl = profile.pictureUrl || ''
          displayName = profile.displayName || response.data.data.fullname
        }

        // Save token
        localStorage.setItem('token', response.data.token)

        // Save customer data from backend
        localStorage.setItem('customer_data', JSON.stringify(response.data.data))

        // Save user info with LINE profile data
        localStorage.setItem('user_info', JSON.stringify({
          userId: formData.value.userId,
          displayName: displayName,
          pictureUrl: pictureUrl,
          fullname: response.data.data.fullname,
          phone_no: response.data.data.phone_no,
          point: response.data.data.point || '0',
          created_at: response.data.data.created_at || null
        }))
      }

      // Redirect to member page
      navigateTo('/member', { replace: true })
    } else {
      otpError.value = response.data.message || 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
    otpError.value = error.response?.data?.message || 'รหัส OTP ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
  } finally {
    isVerifying.value = false
  }
}

// Resend OTP
const handleResendOtp = async () => {
  isSendingOtp.value = true
  otpCode.value = ''
  otpError.value = ''
  otpDigits.value = ['', '', '', '', '', '']

  try {
    // Remove dashes from phone number (keep format: 0869445500)
    const phoneClean = formData.value.phoneNumber.replace(/-/g, '')

    // Call send OTP API again
    const response = await api.post('/auth/otp/send', {
      phone_no: phoneClean
    })

    if (response.data.status === true) {
      // Update reference code
      refCode.value = response.data.data.ref_code || ''

      // Show success message with new ref code
      showToast(`ส่ง OTP ใหม่เรียบร้อยแล้ว\nรหัสอ้างอิง: ${refCode.value}`, 'success')
    } else {
      showToast('เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง', 'error')
    }
  } catch (error) {
    console.error('Resend OTP error:', error)
    showToast(error.response?.data?.message || 'เกิดข้อผิดพลาดในการส่ง OTP กรุณาลองใหม่อีกครั้ง', 'error')
  } finally {
    isSendingOtp.value = false
  }
}

// Go back to step 1
const handleBackToStep1 = () => {
  currentStep.value = 1
  otpCode.value = ''
  otpError.value = ''
  otpDigits.value = ['', '', '', '', '', '']
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

// Handle OTP digit input (for separate boxes)
const handleOtpDigitInput = (index, event) => {
  const input = event.target
  const value = input.value.replace(/\D/g, '')

  if (value) {
    otpDigits.value[index] = value.charAt(value.length - 1)

    // Auto focus next input
    if (index < 5) {
      const nextInput = document.querySelector(`#otp-${index + 1}`)
      if (nextInput) {
        nextInput.focus()
      }
    }
  } else {
    otpDigits.value[index] = ''
  }

  // Combine all digits
  otpCode.value = otpDigits.value.join('')
  otpError.value = ''
}

// Handle backspace on OTP inputs
const handleOtpKeyDown = (index, event) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    const prevInput = document.querySelector(`#otp-${index - 1}`)
    if (prevInput) {
      prevInput.focus()
    }
  }
}

// Handle paste on OTP inputs
const handleOtpPaste = (event) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text').replace(/\D/g, '')
  if (pastedData) {
    const digits = pastedData.substring(0, 6).split('')
    digits.forEach((digit, index) => {
      if (index < 6) {
        otpDigits.value[index] = digit
      }
    })
    otpCode.value = otpDigits.value.join('')

    // Focus last filled input or last input
    const lastIndex = Math.min(digits.length, 6) - 1
    const lastInput = document.querySelector(`#otp-${lastIndex}`)
    if (lastInput) {
      lastInput.focus()
    }
  }
}

// Initialize
onMounted(() => {
  getUserId()
})
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Toast Notification -->
    <div
      v-if="toast.show"
      class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] w-full max-w-md px-4"
    >
      <div
        :class="[
          'rounded-xl shadow-2xl p-4 flex items-center gap-3 animate-slide-down',
          toast.type === 'success' ? 'bg-green-500 text-white' :
          toast.type === 'error' ? 'bg-red-500 text-white' :
          'bg-blue-500 text-white'
        ]"
      >
        <div class="flex-shrink-0">
          <span v-if="toast.type === 'success'" class="text-2xl">✓</span>
          <span v-else-if="toast.type === 'error'" class="text-2xl">✕</span>
          <span v-else class="text-2xl">ℹ</span>
        </div>
        <div class="flex-1 font-medium whitespace-pre-line">{{ toast.message }}</div>
      </div>
    </div>

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
          <p class="text-sm text-gray-600">
            <span v-if="currentStep === 1">กรอกข้อมูลเพื่อเป็นสมาชิก Bug Bite</span>
            <span v-else>ยืนยัน OTP ที่ส่งไปยังเบอร์ {{ formData.phoneNumber }}</span>
          </p>
        </div>

        <!-- Step Indicator -->
        <div class="flex items-center justify-center mb-6">
          <div class="flex items-center gap-3">
            <!-- Step 1 -->
            <div class="flex items-center gap-2">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all"
                :class="currentStep >= 1 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'"
              >
                1
              </div>
              <span class="text-sm font-medium text-gray-700">กรอกข้อมูล</span>
            </div>

            <!-- Connector -->
            <div class="w-12 h-1 rounded" :class="currentStep >= 2 ? 'bg-red-600' : 'bg-gray-300'" />

            <!-- Step 2 -->
            <div class="flex items-center gap-2">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all"
                :class="currentStep >= 2 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'"
              >
                2
              </div>
              <span class="text-sm font-medium text-gray-700">ยืนยัน OTP</span>
            </div>
          </div>
        </div>

        <!-- Registration Card -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <!-- Step 1: Enter Info -->
          <form v-if="currentStep === 1" class="space-y-6" @submit.prevent="handleSendOtp">
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
              :disabled="isSendingOtp"
              class="register-button w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200"
            >
              <span v-if="!isSendingOtp">รับรหัส OTP</span>
              <span v-else class="flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                กำลังส่ง OTP...
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

          <!-- Step 2: Verify OTP -->
          <form v-else class="space-y-6" @submit.prevent="handleVerifyOtp">
            <!-- Reference Code Display -->
            <div v-if="refCode" class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-center">
              <p class="text-xs text-gray-600 mb-1">รหัสอ้างอิง (Ref Code)</p>
              <p class="text-2xl font-black text-blue-600 tracking-wider">{{ refCode }}</p>
            </div>

            <!-- OTP Input - 6 Separate Boxes -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-4 text-center">
                รหัส OTP <span class="text-red-500">*</span>
              </label>
              <div class="flex justify-center gap-2 mb-3">
                <input
                  v-for="(digit, index) in otpDigits"
                  :id="`otp-${index}`"
                  :key="index"
                  v-model="otpDigits[index]"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  class="w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  :class="otpError ? 'border-red-500' : 'border-gray-300'"
                  @input="handleOtpDigitInput(index, $event)"
                  @keydown="handleOtpKeyDown(index, $event)"
                  @paste="index === 0 ? handleOtpPaste($event) : null"
                >
              </div>
              <p v-if="otpError" class="text-xs text-red-500 text-center mb-2">
                {{ otpError }}
              </p>
              <p class="text-xs text-gray-500 text-center">
                กรุณากรอกรหัส OTP 6 หลักที่ส่งไปยังเบอร์ {{ formData.phoneNumber }}
              </p>
            </div>

            <!-- Verify Button -->
            <button
              type="submit"
              :disabled="isVerifying"
              class="register-button w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-200"
            >
              <span v-if="!isVerifying">ยืนยันและลงทะเบียน</span>
              <span v-else class="flex items-center justify-center gap-2">
                <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                กำลังตรวจสอบ...
              </span>
            </button>

            <!-- Resend OTP -->
            <div class="text-center">
              <button
                type="button"
                :disabled="isSendingOtp"
                class="text-sm text-red-600 hover:text-red-700 font-semibold transition-colors"
                @click="handleResendOtp"
              >
                <span v-if="!isSendingOtp">ส่ง OTP อีกครั้ง</span>
                <span v-else>กำลังส่ง...</span>
              </button>
            </div>

            <!-- Back Button -->
            <div class="text-center">
              <button
                type="button"
                class="text-sm text-gray-600 hover:text-red-600 transition-colors"
                @click="handleBackToStep1"
              >
                ← แก้ไขข้อมูล
              </button>
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

/* Toast slide down animation */
@keyframes slide-down {
  from {
    transform: translateY(-100%) translateX(-50%);
    opacity: 0;
  }
  to {
    transform: translateY(0) translateX(-50%);
    opacity: 1;
  }
}

.animate-slide-down {
  animation: slide-down 0.3s ease-out;
}
</style>
