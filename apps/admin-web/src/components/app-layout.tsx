import { LogOutIcon } from 'lucide-react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { NotificationBell } from '@/components/notification-bell'
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
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-2 px-4 sm:gap-4">
          <nav className="flex min-w-0 items-center gap-1">
            <Link to="/" className="mr-1 font-semibold text-primary sm:mr-3">
              Admin
            </Link>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground sm:px-3',
                    isActive && 'bg-accent text-accent-foreground',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <NotificationBell />
            <Button variant="outline" size="sm" onClick={logout} aria-label="Log out">
              <LogOutIcon />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] gap-4 p-4">
        <Outlet />
      </main>
    </div>
  )
}
