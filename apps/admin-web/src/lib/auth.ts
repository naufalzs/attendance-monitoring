import { mutate } from 'swr'

const TOKEN_KEY = 'accessToken'

export const ADMIN_ROLE = 'ADMIN'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  void mutate(() => true, undefined, { revalidate: false })
}

export function getTokenRole(token: string): string | null {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { role } = JSON.parse(atob(payload))
    return typeof role === 'string' ? role : null
  } catch {
    return null
  }
}
