// composables/useEncryptedCookie.ts
// ---- Shared in-memory cache ต่อแท็บ/เพจของ Nuxt ----

const key_allow_public = ['token','fp_email','fp_ref','fp_token'] as const
const isPublicKey = (key: string) => key_allow_public.includes(key as (typeof key_allow_public)[number])

// ✅ ชนิดค่าที่จะเก็บใน cache (สตริงหรืออ็อบเจ็กต์)
type Decrypted = string | Record<string, unknown>

type CacheEntry = {
  cookie: string | null
  data: Decrypted | null
  pending: Promise<Decrypted | null> | null
}

export const decryptedCache = () =>
  useState<Record<string, CacheEntry>>('encCookieCache', () => ({}))

// ---- helpers ----
const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)

/** แปลง unknown -> Decrypted (ถ้าไม่ใช่ string/object ให้ stringify) */
const toDecrypted = (v: unknown): Decrypted => {
  if (typeof v === 'string') return v
  if (isRecord(v)) return v
  try {
    const s = JSON.stringify(v)
    return typeof s === 'string' ? s : String(v)
  } catch {
    return String(v)
  }
}

/** 🔐 เข้ารหัสแล้วเก็บคุกกี้ (อัปเดตแคชด้วย เพื่อไม่ต้องถอดรหัสซ้ำ)
 *  ⚠️ ถ้า key อยู่ใน allowlist จะ "ไม่เข้ารหัส" และเขียนลง cookie ตรงๆ
 */
export async function useEncryptedCookie(key: string, value: unknown): Promise<void> {
  // ✅ bypass เข้ารหัสสำหรับ public keys
  if (isPublicKey(key)) {
    const cookieRef = useCookie<string>(key)
    const toStore = typeof value === 'string' ? value : JSON.stringify(value)
    cookieRef.value = toStore

    // อัปเดตแคชทันที (แปลงให้เป็น Decrypted)
    const cache = decryptedCache().value
    cache[key] = {
      cookie: toStore,
      data: toDecrypted(value),
      pending: null
    }
    return
  }

  // ปกติ: เข้ารหัสผ่าน /api/encrypt
  const res = await $fetch<{ encrypted?: string; error?: string }>('/api/encrypt', {
    method: 'POST',
    body: { data: value }
  })

  if (res?.encrypted) {
    const cookieRef = useCookie<string>(key)
    cookieRef.value = res.encrypted

    // ✅ อัปเดตแคชทันที (เรารู้ค่า plain อยู่แล้ว)
    const cache = decryptedCache().value
    cache[key] = {
      cookie: res.encrypted,
      data: toDecrypted(value),
      pending: null
    }
  }
}

/** 🔓 ถอดรหัสคุกกี้แบบมีแคช + รวมคำขอซ้ำให้เป็นคำขอเดียว
 *  ⚠️ ถ้า key อยู่ใน allowlist จะ "ไม่ถอดรหัส" และอ่านค่า cookie ตรงๆ
 */
type DecryptOk = { data: unknown }
type DecryptErr = { error: string }
type DecryptRes = DecryptOk | DecryptErr

export async function useDecryptedCookie(key: string): Promise<Decrypted | null> {
  const cookieRef = useCookie<string>(key)
  const enc = cookieRef.value || null

  const cache = decryptedCache().value
  // ถ้า cookie ว่าง/ถูกลบ -> เคลียร์แคชของคีย์นี้ด้วย
  if (!enc) {
    if (cache[key]) delete cache[key]
    return null
  }

  // bypass สำหรับ public keys
  if (isPublicKey(key)) {
    let parsed: unknown
    try {
      parsed = JSON.parse(enc)
    } catch {
      parsed = enc
    }
    const data = toDecrypted(parsed)
    cache[key] = { cookie: enc, data, pending: null }
    return data
  }

  const hit = cache[key]

  // cache hit
  if (hit && hit.cookie === enc && hit.data !== null) {
    return hit.data
  }
  // รอคำขอเดิมถ้ามี
  if (hit && hit.cookie === enc && hit.pending) {
    return hit.pending
  }

  // ยิงคำขอใหม่ + coalesce
  const pending: Promise<Decrypted | null> = $fetch<DecryptRes>('/api/decrypt', {
    method: 'POST',
    body: { encrypted: enc }
  })
    .then((res) => {
      const raw = 'data' in res ? res.data : null
      const data: Decrypted | null = raw == null ? null : toDecrypted(raw)
      cache[key] = { cookie: enc, data, pending: null }
      return data
    })
    .catch((err) => {
      cache[key] = { cookie: enc, data: null, pending: null }
      throw err
    })

  // บันทึกสถานะ pending ไว้ก่อน
  cache[key] = { cookie: enc, data: null, pending }

  return pending
}

/** ❌ ลบ cookie เฉพาะ key + ล้างแคชของ key นั้น */
export function useClearEncryptedCookie(key: string) {
  const cookieRef = useCookie<string | null>(key) // 👈 อนุญาต null
  cookieRef.value = null
  const cache = decryptedCache().value
  delete cache[key]
}

/** 🧹 ลบ cookie หลาย key พร้อมกัน + ล้างแคช */
export function useClearEncryptedCookies(keys: string[]) {
  const cache = decryptedCache().value
  keys.forEach((key) => {
    useCookie(key).value = null
    delete cache[key]
  })
}

/** 🔥 ลบ cookie ทั้งหมดที่ระบบคุณใช้ (ฝั่ง client) + ล้างแคชทั้งหมด */
export function useClearAllEncryptedCookies() {
  const cacheState = decryptedCache()
  if (import.meta.client) {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=')
      const name = (eqPos > -1 ? cookie.slice(0, eqPos) : cookie).trim()
      document.cookie = `${name}=; Path=/; Max-Age=0`
    }
  }
  // ล้างทั้งแผนที่แคช
  cacheState.value = {}
}

/** 🧭 ออปชันเสริม: watch ค่า cookie แล้วล้างแคชเมื่อเปลี่ยน (ถ้าต้องการแบบ reactive มากขึ้น)
 *  ใช้ในแต่ละหน้าที่เรียกบ่อย ๆ:
 *     useWatchEncryptedCookie('token') // จะเคลียร์แคชเมื่อ token เปลี่ยน
 */
export function useWatchEncryptedCookie(key: string) {
  const cookieRef = useCookie<string>(key)
  watch(cookieRef, () => {
    const cache = decryptedCache().value
    delete cache[key] // ให้ไป fetch/ถอดรหัสใหม่เมื่อถูกเรียกครั้งต่อไป
  })
}
