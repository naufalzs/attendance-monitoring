import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProfileSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <Skeleton className="size-20 rounded-full" />
        <div className="grid flex-1 gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </CardContent>
    </Card>
  )
}
