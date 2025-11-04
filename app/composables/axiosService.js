// /composables/axiosService.js
import axios from 'axios'

/* ================= Base config (ไม่เรียก useRuntimeConfig ตอน import) ================= */
let _axiosConfigured = false
const ensureAxiosConfigured = () => {
  if (_axiosConfigured) return
  const config = useRuntimeConfig()
  axios.defaults.baseURL = config.public.api_url
  _axiosConfigured = true
}

/* ================= Public API ================= */
const getToken = async () => (await useDecryptedCookie('token')) || ''

export async function request(method, url, data, auth = true) {
  ensureAxiosConfigured()

  const isloadingAxi = useState('isloadingAxi', () => true)
  isloadingAxi.value = true

  const headers = await buildHeaders(auth)

  try {
    // ยิง request ปกติ ไม่มี refresh / retry แล้ว
    return await axios({ method, url, data, headers })
  } catch (error) {
    console.error('request catch (error)', error)
    await routeOnErrorStatus(error?.response?.status)
    throw error
  } finally {
    isloadingAxi.value = false
  }
}

async function buildHeaders(auth) {
  const headers = {}
  if (auth) {
    const token = await getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }
  return headers
}

/* ================= Helpers: อ่าน path ปัจจุบัน ================= */
function getCurrentPath() {
  // พยายามอ่านจาก Nuxt Router ก่อน
  try {
    const router = useRouter()
    const p = router?.currentRoute?.value?.path
    if (p) return p
  } catch { /* noop */ }

  // ฝั่ง client
  if (import.meta.client && typeof window !== 'undefined') {
    try { return window.location.pathname } catch { /* noop */ }
  }

  // ฝั่ง SSR
  try {
    const url = useRequestURL()
    if (url?.pathname) return url.pathname
  } catch { /* noop */ }

  return ''
}

/* ================= Route ตาม error status (ยังใช้เหมือนเดิม) ================= */
async function routeOnErrorStatus(status) {
  const path = getCurrentPath()

  switch (status) {
    case 401: {
      console.warn('Token ไม่ถูกต้อง | หมดอายุ | ไม่มี Token')
      useClearEncryptedCookie('token')

      // ถ้าอยู่หน้า /auth/pass-token ไม่ต้องย้ายไป /auth/login
      if (path === '/auth/pass-token') {
        return
      }

      await navigateTo('/auth/login')
      break
    }
    case 403:
      await navigateTo('/unauthorized')
      break
    case 422:
      // validation error -> ปล่อยให้หน้าที่เรียกจัดการ message เอง
      break
    case 500:
      console.error('Server Error')
      break
    default:
      break
  }
}
