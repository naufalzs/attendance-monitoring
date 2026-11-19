import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import useSWR from 'swr'
import { ProfileSkeleton } from '@/components/profile-skeleton'
import { Button } from '@/components/ui/button'
import type { ProfileContext } from '@/hooks/use-profile'
import { clearToken } from '@/lib/auth'
import type { Profile } from '@/lib/profile'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/profile', label: 'Profile' },
  { to: '/summary', label: 'Summary' },
]

export function AppLayout() {
  const navigate = useNavigate()
  const { data: profile, mutate } = useSWR<Profile>('/profile/me')
  const setProfile = (next: Profile) => mutate(next, { revalidate: false })

  function logout() {
    clearToken()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-svh bg-muted">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between gap-4 px-4">
          <nav className="flex items-center gap-1">
            <Link to="/profile" className="mr-3 font-semibold text-primary">
              Attendance
            </Link>
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
        {profile ? (
          <Outlet context={{ profile, setProfile } satisfies ProfileContext} />
        ) : (
          <ProfileSkeleton />
        )}
      </main>
    </div>
  )
}
