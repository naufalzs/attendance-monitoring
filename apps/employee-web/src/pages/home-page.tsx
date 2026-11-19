import { useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { clearToken } from '@/lib/auth'

export function HomePage() {
  const navigate = useNavigate()

  function logout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <main className="mx-auto flex max-w-3xl items-center justify-between p-6">
      <h1 className="text-xl font-semibold">Attendance</h1>
      <Button variant="outline" onClick={logout}>
        Log out
      </Button>
    </main>
  )
}
