import { NavLink, Outlet, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { clearToken } from '@/lib/auth'
import { cn } from '@/lib/utils'

const navItems = [{ to: '/profile', label: 'Profile' }]

export function AppLayout() {
  const navigate = useNavigate()

  function logout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-svh bg-muted">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4">
          <nav className="flex items-center gap-1">
            <span className="mr-3 font-semibold text-primary">Attendance</span>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground',
                    isActive && 'bg-accent text-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Button variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl p-4">
        <Outlet />
      </main>
    </div>
  )
}
