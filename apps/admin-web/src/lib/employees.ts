export type Employee = {
  id: string
  name: string
  email: string
  position: string
  phone: string
  photoUrl: string | null
  role: 'ADMIN' | 'EMPLOYEE'
}
