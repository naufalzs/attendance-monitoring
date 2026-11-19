import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { Profile } from '@/lib/profile'
import { cn } from '@/lib/utils'

export function ProfileAvatar({
  profile,
  src,
  className,
}: {
  profile: Profile
  src?: string
  className?: string
}) {
  const photoSrc =
    src ??
    (profile.photoUrl
      ? new URL(profile.photoUrl, import.meta.env.VITE_API_URL).href
      : '/default-avatar.svg')

  return (
    <Avatar className={cn('size-20', className)}>
      <AvatarImage src={photoSrc} alt={profile.name} className="object-cover" />
      <AvatarFallback />
    </Avatar>
  )
}
