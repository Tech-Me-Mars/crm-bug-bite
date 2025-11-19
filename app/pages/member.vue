<script setup>
import { ref } from 'vue'

// Disable default layout for this page (we have our own header)
definePageMeta({
  layout: false,
  middleware: 'auth' // Require authentication
})

const config = useRuntimeConfig()
const api = useApi()

// User data
const userId = ref('')
const orderCount = ref(0)

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

// Fetch order count from API
const fetchOrderCount = async () => {
  try {
    if (!userId.value) return

    const response = await api.post('/crmbugbite/v1/order/count', {
      userId: userId.value
    })

    if (response.data.status === true) {
      orderCount.value = response.data.data.order_count || 0
    }
  } catch (error) {
    console.error('Error fetching order count:', error)
  }
}

// Recommended items (disabled for now)
// const _recommendedItems = ref([
//   {
//     id: 1,
//     name: 'Crisp Corita Snacks',
//     price: 289,
//     image: '/images/product-01.png'
//   },
//   {
//     id: 2,
//     name: 'Crisp Special Snacks',
//     price: 29,
//     image: '/images/product-02.png'
//   },
//   {
//     id: 3,
//     name: 'Bug Bite Premium Mix',
//     price: 159,
//     image: '/images/product-03.png'
//   },
//   {
//     id: 4,
//     name: 'Deluxe Insect Combo',
//     price: 399,
//     image: '/images/product-04.png'
//   }
// ])

// Loading state for API
// const _isLoadingRecommended = ref(false)

// Fetch recommended items from API
// const _fetchRecommendedItems = async () => {
//   _isLoadingRecommended.value = true
//   try {
//     await new Promise(resolve => setTimeout(resolve, 500))
//     console.log('Fetched recommended items')
//   } catch (error) {
//     console.error('Error fetching recommended items:', error)
//   } finally {
//     _isLoadingRecommended.value = false
//   }
// }

// Fetch on component mount
onMounted(() => {
  getUserId()
  fetchOrderCount()
  // _fetchRecommendedItems() // Disabled for now
})

// const _handleOrderNow = (item) => {
//   console.log('Order now:', item)
//   navigateTo(`/product/${item.id}`)
// }
</script>

<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Bug Bite Header with Hamburger Menu -->
    <BugBiteHeader />

    <UContainer class="py-6 space-y-6">
      <!-- Recommended for You (Disabled for now) -->
      <!-- <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">รายการแนะนำสำหรับคุณ</h2>

        <div v-if="isLoadingRecommended" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600" />
        </div>

        <div v-else class="overflow-x-auto scrollbar-hide">
          <div class="flex gap-4 pb-2">
            <div
              v-for="item in recommendedItems"
              :key="item.id"
              class="flex-none w-44"
            >
              <div class="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-300">
                <div class="aspect-square flex items-center justify-center p-2 bg-white">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="max-w-full max-h-full object-contain"
                  >
                </div>

                <div class="p-4">
                  <h3 class="font-semibold text-gray-800 text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                    {{ item.name }}
                  </h3>

                  <div class="flex items-baseline gap-1 mb-3">
                    <span class="text-lg font-bold text-gray-900">{{ item.price }}</span>
                    <span class="text-xs text-gray-500">.-</span>
                  </div>

                  <button
                    class="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                    @click="handleOrderNow(item)"
                  >
                    ดูรายการแนะนำ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Additional Info -->
      <div class="bg-white rounded-lg shadow-md p-4 mt-8 mb-24">
        <div class="text-center space-y-2">
          <p class="text-sm font-medium text-gray-800">Bug Bite - ทอดมันแมลง</p>
          <p class="text-xs text-gray-500">อาหารทอดแมลงคุณภาพเยี่ยม สด สะอาด ปลอดภัย</p>
          <div class="flex justify-center gap-4 text-xs text-gray-400">
            <span>{{ config.public.businessHours }}</span>
            <span>•</span>
            <span>โทร: {{ config.public.contactPhone }}</span>
          </div>
        </div>
      </div>

    </UContainer>

    <!-- Bottom Navigation Footer -->
    <BugBiteFooter />
  </div>
</template>

<style scoped>
/* Hide scrollbar for horizontal scroll */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}

/* Smooth scroll behavior */
.overflow-x-auto {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* Line clamp utility */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Additional responsive styles */
@media (max-width: 640px) {
  .grid-cols-3 > button {
    min-height: 100px;
  }
}

/* Smooth animations */
button {
  transition: all 0.3s ease;
}

button:active {
  transform: scale(0.95);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
