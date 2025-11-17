# Bug Bite CRM - API Usage Guide

## การติดตั้ง Axios

```bash
npm install axios
# หรือ
yarn add axios
# หรือ
pnpm add axios
```

## การตั้งค่า Environment Variables

แก้ไขไฟล์ `.env` ในโฟลเดอร์ root:

```env
API_BASE_URL=http://localhost:8000/api
API_TIMEOUT=30000
APP_NAME=Bug Bite CRM
APP_URL=http://localhost:3000
COOKIE_SECRET=your-secret-key-change-this-in-production
```

## การใช้งาน useApi Composable

### 1. Basic Usage (GET, POST, PUT, DELETE)

```vue
<script setup>
const api = useApi()

// GET request
const fetchData = async () => {
  try {
    const response = await api.get('/products')
    console.log(response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}

// POST request
const createData = async () => {
  try {
    const response = await api.post('/orders', {
      productId: '123',
      quantity: 2
    })
    console.log(response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}

// PUT request
const updateData = async () => {
  try {
    const response = await api.put('/profile', {
      fullName: 'John Doe',
      phoneNumber: '081-234-5678'
    })
    console.log(response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}

// DELETE request
const deleteData = async () => {
  try {
    const response = await api.delete('/orders/123')
    console.log(response.data)
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>
```

### 2. Using API Helpers

```vue
<script setup>
const apiHelpers = useApiHelpers()

// Login
const handleLogin = async () => {
  try {
    const response = await apiHelpers.login({
      phoneNumber: '081-234-5678',
      otp: '123456'
    })
    console.log('Login success:', response.data)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// Register
const handleRegister = async () => {
  try {
    const response = await apiHelpers.register({
      fullName: 'John Doe',
      phoneNumber: '081-234-5678'
    })
    console.log('Register success:', response.data)
  } catch (error) {
    console.error('Register failed:', error)
  }
}

// Send OTP
const handleSendOtp = async () => {
  try {
    const response = await apiHelpers.sendOtp('081-234-5678')
    console.log('OTP sent:', response.data)
  } catch (error) {
    console.error('Send OTP failed:', error)
  }
}

// Get Profile
const fetchProfile = async () => {
  try {
    const response = await apiHelpers.getProfile()
    console.log('Profile:', response.data)
  } catch (error) {
    console.error('Get profile failed:', error)
  }
}

// Update Profile
const updateProfile = async () => {
  try {
    const response = await apiHelpers.updateProfile({
      fullName: 'Jane Doe',
      phoneNumber: '081-999-9999'
    })
    console.log('Profile updated:', response.data)
  } catch (error) {
    console.error('Update profile failed:', error)
  }
}

// Get Member Cups
const fetchMemberCups = async () => {
  try {
    const response = await apiHelpers.getMemberCups()
    console.log('Member cups:', response.data)
  } catch (error) {
    console.error('Get member cups failed:', error)
  }
}

// Get Orders
const fetchOrders = async () => {
  try {
    const response = await apiHelpers.getOrders({
      page: 1,
      limit: 10
    })
    console.log('Orders:', response.data)
  } catch (error) {
    console.error('Get orders failed:', error)
  }
}

// Get Products
const fetchProducts = async () => {
  try {
    const response = await apiHelpers.getProducts({
      category: 'fried-insects',
      page: 1,
      limit: 20
    })
    console.log('Products:', response.data)
  } catch (error) {
    console.error('Get products failed:', error)
  }
}
</script>
```

### 3. File Upload

```vue
<script setup>
const api = useApi()

const handleFileUpload = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('description', 'Profile image')

  try {
    const response = await api.upload('/upload/profile-image', formData, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      console.log('Upload progress:', percentCompleted + '%')
    })
    console.log('Upload success:', response.data)
  } catch (error) {
    console.error('Upload failed:', error)
  }
}
</script>
```

### 4. Using with Reactive State

```vue
<script setup>
const apiHelpers = useApiHelpers()

// Loading state
const isLoading = ref(false)
const error = ref(null)
const data = ref(null)

// Fetch data with loading state
const fetchData = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await apiHelpers.getProfile()
    data.value = response.data
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Call on component mount
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="data">
      <pre>{{ data }}</pre>
    </div>
  </div>
</template>
```

## API Endpoints (ตัวอย่าง)

### Authentication
- `POST /auth/register` - ลงทะเบียนสมาชิกใหม่
- `POST /auth/send-otp` - ส่งรหัส OTP
- `POST /auth/verify-otp` - ยืนยันรหัส OTP
- `POST /auth/login` - เข้าสู่ระบบ
- `POST /auth/logout` - ออกจากระบบ

### Profile
- `GET /profile` - ดึงข้อมูลโปรไฟล์
- `PUT /profile` - อัพเดทโปรไฟล์
- `GET /member/cups` - ดึงข้อมูลแก้วสะสม

### Orders
- `GET /orders` - ดึงรายการสั่งซื้อทั้งหมด
- `GET /orders/:id` - ดึงรายละเอียดคำสั่งซื้อ
- `POST /orders` - สร้างคำสั่งซื้อใหม่

### Products
- `GET /products` - ดึงรายการสินค้าทั้งหมด
- `GET /products/:id` - ดึงรายละเอียดสินค้า

## การจัดการ Authentication Token

API composable จะจัดการ token อัตโนมัติ:

1. เมื่อ login สำเร็จ ให้บันทึก token:
```javascript
const token = useCookie('auth_token')
token.value = response.data.token
```

2. Token จะถูกส่งไปใน header ทุกครั้งที่เรียก API
3. เมื่อได้รับ 401 Unauthorized จะ clear token และ redirect ไป register

## การจัดการ Error

```vue
<script setup>
const api = useApi()

const fetchData = async () => {
  try {
    const response = await api.get('/data')
    return response.data
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else if (error.request) {
      // Request was made but no response
      console.error('No response received')
    } else {
      // Something else happened
      console.error('Error:', error.message)
    }
    throw error
  }
}
</script>
```

## TypeScript Support

```typescript
interface User {
  id: string
  fullName: string
  phoneNumber: string
  cups: number
}

const api = useApi()

// Type-safe API call
const getUser = async (): Promise<User> => {
  const response = await api.get<User>('/profile')
  return response.data
}
```
