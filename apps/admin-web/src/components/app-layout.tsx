import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { Button } from '@/components/ui/button'
import { clearToken } from '@/lib/auth'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Attendance' },
  { to: '/employees', label: 'Employees' },
]

export function AppLayout() {
  const navigate = useNavigate()

  function logout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-svh bg-muted">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
          <nav className="flex items-center gap-1">
            <Link to="/" className="mr-3 font-semibold text-primary">
              Attendance Admin
            </Link>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
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
      <main className="mx-auto grid max-w-5xl gap-4 p-4">
        <Outlet />
      </main>
    </div>
  )
}
