import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// Create axios instance
const createApiInstance = (): AxiosInstance => {
  const config = useRuntimeConfig()

  const instance = axios.create({
    baseURL: config.public.apiBaseUrl || 'http://localhost:8000/api',
    timeout: Number(config.public.apiTimeout) || 30000,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if exists
      const token = useCookie('auth_token')
      if (token.value) {
        config.headers.Authorization = `Bearer ${token.value}`
      }

      // Add timestamp to prevent caching
      config.params = {
        ...config.params,
        _t: new Date().getTime()
      }

      return config
    },
    (error) => {
      console.error('Request error:', error)
      return Promise.reject(error)
    }
  )

  // Response interceptor
  instance.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // Handle errors
      if (error.response) {
        const status = error.response.status

        switch (status) {
          case 401:
            // Unauthorized - clear token and redirect to login
            const token = useCookie('auth_token')
            token.value = null
            navigateTo('/register')
            break
          case 403:
            // Forbidden
            console.error('Access forbidden:', error.response.data)
            break
          case 404:
            // Not found
            console.error('Resource not found:', error.response.data)
            break
          case 500:
            // Server error
            console.error('Server error:', error.response.data)
            break
          default:
            console.error('API error:', error.response.data)
        }
      } else if (error.request) {
        console.error('No response received:', error.request)
      } else {
        console.error('Request setup error:', error.message)
      }

      return Promise.reject(error)
    }
  )

  return instance
}

// API request methods
export const useApi = () => {
  const api = createApiInstance()

  return {
    // GET request
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      return api.get<T>(url, config)
    },

    // POST request
    post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      return api.post<T>(url, data, config)
    },

    // PUT request
    put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      return api.put<T>(url, data, config)
    },

    // PATCH request
    patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      return api.patch<T>(url, data, config)
    },

    // DELETE request
    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
      return api.delete<T>(url, config)
    },

    // Upload file
    upload: <T = any>(url: string, formData: FormData, onProgress?: (progressEvent: any) => void): Promise<AxiosResponse<T>> => {
      return api.post<T>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: onProgress
      })
    }
  }
}

// Composable for common API calls
export const useApiHelpers = () => {
  const api = useApi()

  return {
    // Authentication
    login: (credentials: { phoneNumber: string; otp: string }) => {
      return api.post('/auth/login', credentials)
    },

    register: (data: { fullName: string; phoneNumber: string }) => {
      return api.post('/auth/register', data)
    },

    sendOtp: (phoneNumber: string) => {
      return api.post('/auth/send-otp', { phoneNumber })
    },

    verifyOtp: (phoneNumber: string, otp: string) => {
      return api.post('/auth/verify-otp', { phoneNumber, otp })
    },

    // Profile
    getProfile: () => {
      return api.get('/profile')
    },

    updateProfile: (data: { fullName?: string; phoneNumber?: string }) => {
      return api.put('/profile', data)
    },

    // Member cups
    getMemberCups: () => {
      return api.get('/member/cups')
    },

    // Orders
    getOrders: (params?: { page?: number; limit?: number }) => {
      return api.get('/orders', { params })
    },

    getOrderDetail: (orderId: string) => {
      return api.get(`/orders/${orderId}`)
    },

    createOrder: (data: any) => {
      return api.post('/orders', data)
    },

    // Products
    getProducts: (params?: { category?: string; page?: number; limit?: number }) => {
      return api.get('/products', { params })
    },

    getProductDetail: (productId: string) => {
      return api.get(`/products/${productId}`)
    }
  }
}
