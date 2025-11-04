//server/api/decrypt.post.ts
import { readBody } from 'h3'
import CryptoJS from 'crypto-js'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ encrypted: string }>(event)
  const config = useRuntimeConfig()
  const secret = config.cookieSecret


  try {
    const bytes = CryptoJS.AES.decrypt(body.encrypted, secret)
    const decrypted = bytes.toString(CryptoJS.enc.Utf8)
    return { data: JSON.parse(decrypted) }
  } catch (err) {
    return { error: 'Invalid or corrupted data' }
  }
})
