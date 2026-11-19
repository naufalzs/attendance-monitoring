import { useOutletContext } from 'react-router'
import type { Profile } from '@/lib/profile'

export type ProfileContext = {
  profile: Profile
  setProfile: (profile: Profile) => void
}

export function useProfile() {
  return useOutletContext<ProfileContext>()
}
