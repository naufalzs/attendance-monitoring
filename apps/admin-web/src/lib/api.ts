import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

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
