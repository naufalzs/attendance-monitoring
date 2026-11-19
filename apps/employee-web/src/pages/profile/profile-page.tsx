import { CameraIcon, PencilIcon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AttendanceCard } from './attendance-card'
import { ProfileAvatar } from './profile-avatar'
import { useProfile } from '@/hooks/use-profile'

export function ProfilePage() {
  const { profile } = useProfile()

  return (
    <div className="grid gap-4">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <Link
            to="photo"
            aria-label="Change photo"
            className="group relative rounded-full focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <ProfileAvatar profile={profile} />
            <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <CameraIcon className="size-6" />
            </span>
          </Link>
          <dl className="grid gap-1">
            <dt className="sr-only">Name</dt>
            <dd className="text-lg font-semibold">{profile.name}</dd>
            <dt className="sr-only">Position</dt>
            <dd className="text-sm text-muted-foreground">{profile.position}</dd>
            <dt className="sr-only">Email</dt>
            <dd className="text-sm">{profile.email}</dd>
            <dt className="sr-only">Phone number</dt>
            <dd className="flex items-center justify-center gap-1 text-sm sm:justify-start">
              {profile.phone}
              <Button
                variant="ghost"
                size="icon-lg"
                className="hover:bg-foreground/10 [&_svg]:size-5"
                asChild
              >
                <Link to="phone" aria-label="Edit phone number">
                  <PencilIcon />
                </Link>
              </Button>
            </dd>
          </dl>
        </CardContent>
      </Card>
      <AttendanceCard name={profile.name} />
    </div>
  )
}
