<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Menu items for bottom navigation (3 items)
const menuItems = [
  {
    id: 'orders',
    label: 'ประวัติ',
    icon: '📋',
    route: '/orders',
    color: 'from-emerald-500 to-green-600',
    activeColor: 'bg-emerald-500'
  },
  {
    id: 'menu',
    label: 'bugbite',
    subtitle: 'แมลงมันมันส์',
    icon: '/assets/images/bug-bite-icon.png', // Logo image
    route: '/member',
    color: 'from-red-500 to-orange-600',
    activeColor: 'bg-red-500',
    isMain: true, // Main center button
    hasImage: true // Use image instead of emoji
  },
  {
    id: 'profile',
    label: 'ฉัน',
    icon: '👤',
    route: '/profile',
    color: 'from-blue-500 to-cyan-600',
    activeColor: 'bg-blue-500'
  }
]

// Check if menu item is active
const isActive = (itemRoute) => {
  return route.path === itemRoute
}
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 z-50">
    <!-- Main Navigation Bar -->
    <div class="relative">
      <!-- Background with shadow -->
      <div class="bg-white border-t border-gray-200 shadow-2xl">
        <div class="relative px-4 pb-safe">
          <nav class="flex items-end justify-around h-20 relative">
            <!-- Menu Items -->
            <NuxtLink
              v-for="item in menuItems"
              :key="item.id"
              :to="item.route"
              :class="[
                'flex flex-col items-center justify-end transition-all duration-300',
                item.isMain ? 'relative -top-6' : 'flex-1 pb-2'
              ]"
            >
              <!-- Main Center Button (BUG BITE) -->
              <template v-if="item.isMain">
                <div
                  :class="[
                    'relative group',
                    isActive(item.route) ? 'scale-110' : 'hover:scale-105'
                  ]"
                >
                  <!-- Outer glow circle -->
                  <div
                    :class="[
                      'absolute inset-0 rounded-full blur-xl opacity-40 transition-all',
                      `bg-gradient-to-br ${item.color}`
                    ]"
                  ></div>

                  <!-- Main button -->
                  <div
                    :class="[
                      'relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all transform overflow-hidden',
                      `bg-gradient-to-br ${item.color}`,
                      isActive(item.route) ? 'ring-4 ring-red-300' : ''
                    ]"
                  >
                    <!-- Bug Bite Logo -->
                    <img
                      v-if="item.hasImage"
                      :src="item.icon"
                      :alt="item.label"
                      class="w-14 h-14 object-cover rounded-full animate-bounce-slow"
                      @error="(e) => e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Ctext y=%22.9em%22 font-size=%2290%22%3E🐛%3C/text%3E%3C/svg%3E'"
                    />
                    <!-- Fallback emoji if no image -->
                    <div v-else class="text-4xl animate-bounce-slow">{{ item.icon }}</div>
                  </div>

                  <!-- Label below -->
                  <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center">
                    <div
                      :class="[
                        'text-xs font-bold transition-colors',
                        isActive(item.route) ? 'text-red-600' : 'text-gray-700'
                      ]"
                    >
                      {{ item.label }}
                    </div>
                    <div
                      v-if="item.subtitle"
                      :class="[
                        'text-[10px] font-medium transition-colors',
                        isActive(item.route) ? 'text-red-500' : 'text-gray-500'
                      ]"
                    >
                      {{ item.subtitle }}
                    </div>
                  </div>
                </div>
              </template>

              <!-- Regular Menu Items -->
              <template v-else>
                <div class="relative flex flex-col items-center gap-1 group">
                  <!-- Icon Container -->
                  <div
                    :class="[
                      'w-12 h-12 rounded-2xl flex items-center justify-center transition-all transform',
                      isActive(item.route)
                        ? `bg-gradient-to-br ${item.color} shadow-lg scale-110`
                        : 'bg-gray-100 hover:bg-gray-200 group-hover:scale-105'
                    ]"
                  >
                    <div
                      :class="[
                        'text-2xl transition-all',
                        isActive(item.route) ? 'scale-110' : ''
                      ]"
                    >
                      {{ item.icon }}
                    </div>
                  </div>

                  <!-- Label -->
                  <span
                    :class="[
                      'text-xs font-medium transition-colors',
                      isActive(item.route) ? 'text-gray-900 font-bold' : 'text-gray-500'
                    ]"
                  >
                    {{ item.label }}
                  </span>

                  <!-- Active Indicator Dot -->
                  <div
                    v-if="isActive(item.route)"
                    :class="[
                      'absolute -bottom-1 w-1 h-1 rounded-full',
                      item.activeColor
                    ]"
                  ></div>
                </div>
              </template>
            </NuxtLink>
          </nav>
        </div>
      </div>

      <!-- Bottom Safe Area (for iOS devices) -->
      <div class="bg-white h-safe"></div>
    </div>
  </footer>
</template>

<style scoped>
/* Safe area for mobile devices */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.h-safe {
  height: env(safe-area-inset-bottom, 0px);
}

/* Slow bounce animation for main button */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce-slow {
  animation: bounce-slow 2s ease-in-out infinite;
}

/* Hover effects */
nav a {
  -webkit-tap-highlight-color: transparent;
}

/* Smooth transitions */
* {
  transition-property: transform, background-color, box-shadow, color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
