<script setup>
import { ref } from 'vue'
import { object, string, boolean, ref as yupRef } from 'yup'

// ✅ สร้าง schema ด้วย Yup (Best practice กับ UForm)
const schema = object({
  first_name: string().required('กรุณากรอกชื่อ'),
  last_name: string().required('กรุณากรอกนามสกุล'),
  email: string()
    .email('รูปแบบอีเมลไม่ถูกต้อง')
    .required('กรุณากรอกอีเมล'),
  phone: string()
    .matches(/^[0-9]{9,10}$/, 'กรุณากรอกเบอร์โทร 9–10 หลัก (เฉพาะตัวเลข)')
    .required('กรุณากรอกเบอร์โทร'),
  password: string()
    .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
    .required('กรุณากรอกรหัสผ่าน'),
  confirm_password: string()
    .oneOf([yupRef('password')], 'รหัสผ่านยืนยันไม่ตรงกัน')
    .required('กรุณายืนยันรหัสผ่าน'),
  address: string().required('กรุณากรอกที่อยู่'),
  accept_terms: boolean()
    .oneOf([true], 'กรุณายอมรับเงื่อนไขการใช้งาน')
})

// ✅ ใช้ ref (ไม่ใช้ reactive) – ใน template จะถูก unwrap แล้วใช้ `state.xxx` ได้เลย
const state = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  address: '',
  accept_terms: false
})

const loading = ref(false)
const toast = useToast()

function resetForm() {
  state.value = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    address: '',
    accept_terms: false
  }
}

// onSubmit แบบ best practice: มี loading + toast + try/catch
const onSubmit = async (event) => {
  loading.value = true
  try {
    const payload = event.data

    // ⭐ จุดยิง API ลงทะเบียนลูกค้า
    // await $fetch('/api/customers', {
    //   method: 'POST',
    //   body: payload
    // })

    toast.add({
      title: 'บันทึกสำเร็จ',
      description: 'ลงทะเบียนลูกค้าใหม่เรียบร้อยแล้ว',
      color: 'success'
    })

    resetForm()
  } catch (error) {
    console.error(error)
    toast.add({
      title: 'เกิดข้อผิดพลาด',
      description: error?.message || 'ไม่สามารถลงทะเบียนลูกค้าได้',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UContainer class="py-8">
    <div class="max-w-2xl mx-auto">
      <UCard>
        <template #header>
          <div class="space-y-1">
            <h1 class="text-xl font-semibold text-default">
              ลงทะเบียนลูกค้าใหม่
            </h1>
            <p class="text-sm text-muted">
              กรอกข้อมูลลูกค้าให้ครบถ้วนสำหรับสร้างบัญชีในระบบ
            </p>
          </div>
        </template>

        <!-- ✅ UForm + Yup schema + state (ref) -->
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <!-- ชื่อ / นามสกุล -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="ชื่อ" name="first_name">
              <UInput
                v-model="state.first_name"
                placeholder="เช่น สมชาย"
              />
            </UFormField>

            <UFormField label="นามสกุล" name="last_name">
              <UInput
                v-model="state.last_name"
                placeholder="เช่น ใจดี"
              />
            </UFormField>
          </div>

          <!-- Email -->
          <UFormField label="อีเมล" name="email" help="ใช้สำหรับเข้าสู่ระบบและติดต่อกลับ">
            <UInput
              v-model="state.email"
              type="email"
              placeholder="customer@example.com"
            />
          </UFormField>

          <!-- Phone -->
          <UFormField label="เบอร์โทรศัพท์" name="phone">
            <UInput
              v-model="state.phone"
              type="tel"
              inputmode="numeric"
              placeholder="เช่น 0891234567"
            />
          </UFormField>

          <!-- Password / Confirm -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormField label="รหัสผ่าน" name="password">
              <UInput
                v-model="state.password"
                type="password"
                placeholder="อย่างน้อย 8 ตัวอักษร"
              />
            </UFormField>

            <UFormField label="ยืนยันรหัสผ่าน" name="confirm_password">
              <UInput
                v-model="state.confirm_password"
                type="password"
                placeholder="กรอกซ้ำให้ตรงกับรหัสผ่าน"
              />
            </UFormField>
          </div>

          <!-- Address -->
          <UFormField label="ที่อยู่" name="address">
            <UTextarea
              v-model="state.address"
              :rows="3"
              placeholder="บ้านเลขที่, หมู่บ้าน, ถนน, ตำบล, อำเภอ, จังหวัด, รหัสไปรษณีย์"
            />
          </UFormField>

          <!-- Terms -->
          <UFormField name="accept_terms">
            <div class="flex items-start gap-2">
              <UCheckbox v-model="state.accept_terms" />
              <span class="text-sm text-muted">
                ฉันยอมรับ
                <button
                  type="button"
                  class="text-primary underline underline-offset-2"
                >
                  เงื่อนไขการใช้งาน
                </button>
                และ
                <button
                  type="button"
                  class="text-primary underline underline-offset-2"
                >
                  นโยบายความเป็นส่วนตัว
                </button>
              </span>
            </div>
          </UFormField>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <UButton
              color="neutral"
              variant="soft"
              type="button"
              @click="resetForm"
            >
              ล้างข้อมูล
            </UButton>

            <UButton
              type="submit"
              color="primary"
              :loading="loading"
              icon="i-heroicons-user-plus"
            >
              บันทึกลูกค้า
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </UContainer>
</template>
