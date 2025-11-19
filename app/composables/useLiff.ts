import liff from '@line/liff'

export const useLiff = () => {
  const config = useRuntimeConfig()
  const isInitialized = ref(false)
  const isLoggedIn = ref(false)
  const profile = ref<any>(null)
  const error = ref<string | null>(null)

  // Initialize LIFF
  const initLiff = async () => {
    try {
      const liffId = config.public.liffId

      if (!liffId) {
        throw new Error('LIFF_ID is not configured in environment variables')
      }

      await liff.init({ liffId })
      isInitialized.value = true

      // Check if user is logged in
      if (liff.isLoggedIn()) {
        isLoggedIn.value = true
        // Get user profile
        profile.value = await liff.getProfile()
      } else {
        // Redirect to LINE login
        liff.login()
      }

      return true
    } catch (err: any) {
      console.error('LIFF initialization failed:', err)
      error.value = err.message || 'Failed to initialize LIFF'
      return false
    }
  }

  // Get user profile
  const getProfile = async () => {
    if (!liff.isLoggedIn()) {
      throw new Error('User is not logged in')
    }

    try {
      const userProfile = await liff.getProfile()
      profile.value = userProfile
      return userProfile
    } catch (err: any) {
      console.error('Failed to get profile:', err)
      throw err
    }
  }

  // Get access token
  const getAccessToken = () => {
    if (!liff.isLoggedIn()) {
      return null
    }
    return liff.getAccessToken()
  }

  // Get ID Token
  const getIDToken = () => {
    if (!liff.isLoggedIn()) {
      return null
    }
    return liff.getIDToken()
  }

  // Logout
  const logout = () => {
    if (liff.isLoggedIn()) {
      liff.logout()
      isLoggedIn.value = false
      profile.value = null
    }
  }

  // Close LIFF window
  const closeLiff = () => {
    liff.closeWindow()
  }

  // Open external browser
  const openExternalBrowser = (url: string) => {
    liff.openWindow({
      url,
      external: true
    })
  }

  // Send messages to LINE chat
  const sendMessages = async (messages: any[]) => {
    if (!liff.isLoggedIn()) {
      throw new Error('User is not logged in')
    }

    try {
      await liff.sendMessages(messages)
      return true
    } catch (err: any) {
      console.error('Failed to send messages:', err)
      throw err
    }
  }

  // Share target picker
  const shareTargetPicker = async (messages: any[]) => {
    if (!liff.isLoggedIn()) {
      throw new Error('User is not logged in')
    }

    try {
      const result = await liff.shareTargetPicker(messages)
      return result
    } catch (err: any) {
      console.error('Failed to share:', err)
      throw err
    }
  }

  // Get LIFF context
  const getContext = () => {
    return liff.getContext()
  }

  // Get OS
  const getOS = () => {
    return liff.getOS()
  }

  // Get language
  const getLanguage = () => {
    return liff.getLanguage()
  }

  // Get version
  const getVersion = () => {
    return liff.getVersion()
  }

  // Get LINE version
  const getLineVersion = () => {
    return liff.getLineVersion()
  }

  // Check if in LINE client
  const isInClient = () => {
    return liff.isInClient()
  }

  // Check if API is available
  const isApiAvailable = (apiName: string) => {
    return liff.isApiAvailable(apiName)
  }

  return {
    // State
    isInitialized,
    isLoggedIn,
    profile,
    error,

    // Methods
    initLiff,
    getProfile,
    getAccessToken,
    getIDToken,
    logout,
    closeLiff,
    openExternalBrowser,
    sendMessages,
    shareTargetPicker,
    getContext,
    getOS,
    getLanguage,
    getVersion,
    getLineVersion,
    isInClient,
    isApiAvailable
  }
}
