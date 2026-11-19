import { Outlet, useNavigate } from 'react-router'
import useSWR from 'swr'
import { AccountMenu } from '@/components/account-menu'
import { MainNav } from '@/components/main-nav'
import { ProfileSkeleton } from '@/components/profile-skeleton'
import type { ProfileContext } from '@/hooks/use-profile'
import { clearToken } from '@/lib/auth'
import type { Profile } from '@/lib/profile'

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
          <MainNav />
          <AccountMenu name={profile?.name ?? 'Account'} onLogout={logout} />
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
