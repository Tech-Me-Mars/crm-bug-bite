<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(false)

// ตัวอย่างข้อมูล user (เอาไว้เผื่ออนาคตจะต่อกับ auth จริง)
const user = ref({
  name: 'สมชาย ลูกค้า',
  email: 'customer@example.com'
})

const onLoginClick = () => {
  // TODO: ใส่ logic เปิด modal login หรือ redirect ไปหน้า /login
  console.log('go to login page')
}

const onRegisterClick = () => {
  // TODO: ใส่ logic ไปหน้า /register
  console.log('go to register page')
}

const onLogoutClick = () => {
  // TODO: ใส่ logic logout จริง
  console.log('logout user')
}
</script>

<template>
  <div class="min-h-screen bg-default text-default flex flex-col">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 border-b border-default bg-default/80 backdrop-blur"
    >
      <UContainer class="flex items-center justify-between h-16 gap-4">
        <!-- โลโก้/ชื่อเว็บ -->
        <NuxtLink
          to="/"
          class="flex items-center gap-3 hover:opacity-90 transition"
        >
          <!-- วงกลมโลโก้เล็ก ๆ เผื่ออนาคตจะใส่รูป -->
          <div
            class="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-inverted shadow-sm"
          >
            BB
          </div>

          <div class="flex flex-col leading-tight">
            <span class="text-lg font-semibold tracking-wide">
              BUG BITE
            </span>
            <span class="text-xs text-muted">
              แมลงทอด • Crispy Insect Snack
            </span>
          </div>
        </NuxtLink>

        <!-- ข้อมูล Login ด้านขวา -->
        <div class="flex items-center gap-3">
          <!-- ถ้ายังไม่ล็อกอิน -->
          <template v-if="!isLoggedIn">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              class="hidden sm:inline-flex"
              @click="onRegisterClick"
            >
              สมัครสมาชิก
            </UButton>

            <UButton
              color="primary"
              size="sm"
              icon="i-heroicons-arrow-right-on-rectangle"
              @click="onLoginClick"
            >
              เข้าสู่ระบบ
            </UButton>
          </template>

          <!-- ถ้าล็อกอินแล้ว -->
          <template v-else>
            <div class="flex items-center gap-3">
              <UAvatar
                :alt="user.name"
                size="sm"
                class="bg-primary/10"
              />

              <div class="hidden sm:flex flex-col text-right">
                <span class="text-sm font-medium truncate">
                  {{ user.name }}
                </span>
                <span class="text-xs text-muted truncate max-w-[160px]">
                  {{ user.email }}
                </span>
              </div>

              <UButton
                size="xs"
                variant="ghost"
                color="neutral"
                icon="i-heroicons-arrow-left-on-rectangle"
                @click="onLogoutClick"
              >
                ออกจากระบบ
              </UButton>
            </div>
          </template>
        </div>
      </UContainer>
    </header>

    <!-- เนื้อหาแต่ละหน้า -->
    <main class="flex-1">
      <!-- อยากให้หน้าแต่ละหน้า control container เองก็เปลี่ยนตรงนี้ทีหลังได้ -->
      <UContainer class="py-6">
        <slot />
      </UContainer>
    </main>
  </div>
</template>
