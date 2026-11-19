import { Outlet } from 'react-router'
import useSWR from 'swr'
import { ProfileSkeleton } from '@/components/profile-skeleton'
import type { Profile } from '@/lib/profile'
import type { ProfileContext } from './use-profile'

export function ProfileLayout() {
  const { data: profile, mutate } = useSWR<Profile>('/profile/me')

  if (!profile) return <ProfileSkeleton />

  const setProfile = (next: Profile) => mutate(next, { revalidate: false })

  return <Outlet context={{ profile, setProfile } satisfies ProfileContext} />
}
