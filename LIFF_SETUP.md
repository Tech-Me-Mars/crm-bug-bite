# Bug Bite CRM - LINE LIFF Setup Guide

## การติดตั้งและตั้งค่า LINE LIFF

### 1. ติดตั้ง Dependencies (เสร็จแล้ว ✅)

```bash
npm install @line/liff axios
```

### 2. สร้าง LIFF App ใน LINE Developers Console

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. เลือก Provider หรือสร้างใหม่
3. สร้าง Channel ประเภท "LINE Login"
4. ไปที่แท็บ "LIFF" และคลิก "Add"
5. กรอกข้อมูล:
   - **LIFF app name**: Bug Bite CRM
   - **Size**: Full
   - **Endpoint URL**: `https://your-domain.com` (หรือ `https://liff.line.me/xxxxx` สำหรับ development)
   - **Scope**:
     - ✅ profile
     - ✅ openid
     - ✅ email (optional)
   - **Bot link feature**: Optional

6. คัดลอก **LIFF ID** (รูปแบบ: `1234567890-abcdefgh`)

### 3. ตั้งค่า Environment Variables

แก้ไขไฟล์ `.env`:

```env
# LINE LIFF Configuration
LIFF_ID=1234567890-abcdefgh
```

### 4. โครงสร้างไฟล์ที่สร้างขึ้น

```
app/
├── composables/
│   ├── useLiff.ts          # LIFF composable (เสร็จแล้ว ✅)
│   └── useApi.ts           # API composable (เสร็จแล้ว ✅)
├── pages/
│   └── index.vue           # LIFF loading & auth page (เสร็จแล้ว ✅)
```

## การทำงานของ LIFF Flow

### ลำดับการทำงาน:

```
1. User เปิด LIFF App
   ↓
2. index.vue โหลด → แสดง Loading
   ↓
3. Initialize LIFF SDK
   ↓
4. ตรวจสอบ LINE Login Status
   ├─ ยังไม่ Login → Redirect ไป LINE Login
   └─ Login แล้ว → ดำเนินการต่อ
      ↓
5. ดึง LINE Profile (userId, displayName, pictureUrl)
   ↓
6. ส่งข้อมูลไป Backend API
   POST /auth/line
   Body: { userId, displayName, pictureUrl, idToken, accessToken }
   ↓
7. รับ Response จาก Backend
   ├─ Success (200) → บันทึก token → Redirect ไป /member
   ├─ Not Found (404) → ยังไม่ลงทะเบียน → Redirect ไป /register
   └─ Error → แสดงข้อความ error
```

## Backend API Endpoint ที่ต้องสร้าง

### POST /auth/line

**Request Body:**
```json
{
  "userId": "U1234567890abcdef",
  "displayName": "John Doe",
  "pictureUrl": "https://profile.line-scdn.net/...",
  "statusMessage": "Hello!",
  "idToken": "eyJhbGci...",
  "accessToken": "eyJhbGci..."
}
```

**Response (Success - User exists):**
```json
{
  "success": true,
  "token": "your-auth-token-here",
  "user": {
    "id": "123",
    "userId": "U1234567890abcdef",
    "displayName": "John Doe",
    "phoneNumber": "081-234-5678",
    "cups": 8
  }
}
```

**Response (Not Found - User not registered):**
```json
{
  "success": false,
  "message": "User not found",
  "code": 404
}
```

## การใช้งาน useLiff Composable

### Basic Usage

```vue
<script setup>
const liff = useLiff()

onMounted(async () => {
  // Initialize LIFF
  await liff.initLiff()

  // Check login status
  if (liff.isLoggedIn.value) {
    // Get profile
    const profile = await liff.getProfile()
    console.log('User:', profile)

    // Get tokens
    const accessToken = liff.getAccessToken()
    const idToken = liff.getIDToken()
  }
})
</script>
```

### Available Methods

```typescript
// State
liff.isInitialized    // ref<boolean>
liff.isLoggedIn       // ref<boolean>
liff.profile          // ref<LiffProfile | null>
liff.error            // ref<string | null>

// Methods
await liff.initLiff()                     // Initialize LIFF
await liff.getProfile()                   // Get LINE profile
liff.getAccessToken()                     // Get access token
liff.getIDToken()                         // Get ID token
liff.logout()                             // Logout from LINE
liff.closeLiff()                          // Close LIFF window
liff.openExternalBrowser(url)             // Open external browser
await liff.sendMessages(messages)         // Send messages to LINE
await liff.shareTargetPicker(messages)    // Share with target picker
liff.getContext()                         // Get LIFF context
liff.getOS()                              // Get OS (ios/android/web)
liff.getLanguage()                        // Get language
liff.isInClient()                         // Check if in LINE app
liff.isApiAvailable(apiName)              // Check API availability
```

### LINE Profile Object

```typescript
interface LiffProfile {
  userId: string          // LINE User ID
  displayName: string     // Display name
  pictureUrl?: string     // Profile picture URL
  statusMessage?: string  // Status message
}
```

### ตัวอย่างการส่งข้้อความ

```vue
<script setup>
const liff = useLiff()

const sendMessage = async () => {
  try {
    await liff.sendMessages([
      {
        type: 'text',
        text: 'สั่งซื้อสำเร็จ! ขอบคุณที่ใช้บริการ Bug Bite'
      },
      {
        type: 'flex',
        altText: 'Order Confirmation',
        contents: {
          // Flex Message JSON
        }
      }
    ])
    console.log('Message sent!')
  } catch (error) {
    console.error('Failed to send message:', error)
  }
}
</script>
```

### ตัวอย่างการ Share

```vue
<script setup>
const liff = useLiff()

const sharePromotion = async () => {
  try {
    const result = await liff.shareTargetPicker([
      {
        type: 'text',
        text: 'ลองทอดมันแมลงของ Bug Bite กันเถอะ! อร่อยและมีประโยชน์'
      }
    ])

    if (result) {
      console.log('Shared successfully!')
    }
  } catch (error) {
    console.error('Failed to share:', error)
  }
}
</script>
```

## Testing LIFF Locally

### 1. ใช้ LIFF Inspector (แนะนำ)

```bash
# ติดตั้ง LIFF Inspector
npm install -g @line/liff-inspector

# รันเซิร์ฟเวอร์
npm run dev

# เปิด LIFF Inspector
liff-inspector
```

จากนั้นเข้า: `https://liff-inspector.line.me/?liffId=YOUR_LIFF_ID&inspectUrl=http://localhost:3000`

### 2. ใช้ ngrok สำหรับทดสอบบนมือถือ

```bash
# ติดตั้ง ngrok
npm install -g ngrok

# รันเซิร์ฟเวอร์
npm run dev

# เปิด tunnel
ngrok http 3000
```

จากนั้นอัพเดท LIFF Endpoint URL ใน LINE Developers Console เป็น ngrok URL

## Cookie & Storage

แอพจะบันทึกข้อมูลดังนี้:

```typescript
// Authentication token
useCookie('auth_token')

// User info from LINE
useCookie('user_info')  // { userId, displayName, pictureUrl }

// LINE profile (temporary for registration)
useCookie('line_profile')
```

## Security Considerations

1. **ตรวจสอบ ID Token** - Backend ควรตรวจสอบ ID Token กับ LINE API
2. **HTTPS Only** - ใช้ HTTPS สำหรับ production
3. **Token Expiration** - ตรวจสอบและ refresh token
4. **Rate Limiting** - จำกัดการเรียก API
5. **CORS** - ตั้งค่า CORS อย่างถูกต้อง

## Troubleshooting

### LIFF initialization failed

```
Error: LIFF_ID is not configured
```
**Solution**: ตรวจสอบว่าตั้งค่า `LIFF_ID` ใน `.env` แล้ว

### User is not logged in

```
Error: User is not logged in
```
**Solution**: เรียก `liff.login()` เพื่อ redirect ไป LINE Login

### API call failed

```
Error: 401 Unauthorized
```
**Solution**: ตรวจสอบ token และ authentication flow

## Production Checklist

- [ ] ตั้งค่า LIFF_ID ใน production environment
- [ ] อัพเดท LIFF Endpoint URL เป็น production domain
- [ ] เปิดใช้ HTTPS
- [ ] ตั้งค่า CORS ใน backend
- [ ] ทดสอบ authentication flow
- [ ] ทดสอบบนมือถือจริง (iOS และ Android)
- [ ] ตรวจสอบ error handling
- [ ] เพิ่ม analytics/logging

## ลิงก์ที่เป็นประโยชน์

- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [LIFF SDK Reference](https://developers.line.biz/en/reference/liff/)
- [LINE Developers Console](https://developers.line.biz/console/)
- [LIFF Inspector](https://liff-inspector.line.me/)
