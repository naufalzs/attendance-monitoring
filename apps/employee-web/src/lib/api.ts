import axios from 'axios'
import { clearToken, getToken } from '@/lib/auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401 && getToken()) {
      clearToken()
      window.location.assign('/login')
    }
    return Promise.reject(error)
  },
)

export type FetchKey = string | readonly [url: string, params?: Record<string, unknown>]

export async function fetcher<T>(key: FetchKey): Promise<T> {
  const [url, params] = typeof key === 'string' ? [key] : key
  const { data } = await api.get<T>(url, { params })
  return data
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message
    if (Array.isArray(message)) return message.join(', ')
    if (typeof message === 'string') return message
  }
  return "We couldn't complete your request. Please try again in a moment."
}
