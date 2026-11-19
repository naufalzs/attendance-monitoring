import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTodayAttendance } from '@/hooks/use-today-attendance'
import { cn } from '@/lib/utils'
import { AttendanceTimes } from './attendance-times'
import { LiveClock } from './live-clock'

export function AttendanceCard({ name }: { name: string }) {
  const { today, clock, isClocking } = useTodayAttendance()

  if (today === undefined) {
    return (
      <Card>
        <CardContent className="grid gap-4">
          <Skeleton className="mx-auto h-10 w-40" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  const done = Boolean(today?.clockOutAt)

  return (
    <Card>
      <CardContent className="grid gap-5 text-center">
        {!done && <LiveClock />}

        {done ? (
          <p className="flex min-h-16 flex-col justify-center text-lg font-semibold text-primary">
            <span>Great work today, {name}!</span>
            <span>Thanks for your effort, enjoy your rest.</span>
          </p>
        ) : (
          <Button
            size="lg"
            className={cn(
              'h-16 w-full text-lg',
              today && 'bg-foreground text-background hover:bg-foreground/85',
            )}
            disabled={isClocking}
            onClick={clock}
          >
            {isClocking ? 'Saving…' : today ? 'Clock out' : 'Clock in'}
          </Button>
        )}

        {today && <AttendanceTimes attendance={today} />}
      </CardContent>
    </Card>
  )
}
