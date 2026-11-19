import { mutate } from 'swr'

const TOKEN_KEY = 'accessToken'

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token)

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  void mutate(() => true, undefined, { revalidate: false })
}
