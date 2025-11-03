<template>
  <div class="space-y-4 p-6 bg-default">
    <!-- ปุ่มสไตล์ Bootstrap-ish -->
    <div class="flex flex-wrap gap-3">
      <UButton color="primary">Primary</UButton>
      <UButton color="secondary" variant="soft">Secondary</UButton>
      <UButton color="success">Success</UButton>
      <UButton color="info">Info</UButton>
      <UButton color="warning">Warning</UButton>
      <UButton color="error">Danger</UButton>
    </div>

    <!-- การ์ดพื้นหลังขาวแบบ dashboard CRM -->
    <UCard class="bg-elevated border border-default">
      <h2 class="text-lg font-semibold text-default mb-1">
        แดชบอร์ดภาพรวม
      </h2>
      <p class="text-muted">
        ตัวอย่าง theme แบบ light โทน Bootstrap ด้วย Nuxt UI + Tailwind
      </p>
    </UCard>
  </div>
</template>
