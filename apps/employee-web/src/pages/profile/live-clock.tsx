import { useNow } from '@/hooks/use-now'
import { jakartaLongDate, jakartaTime } from '@/lib/attendance'

export function LiveClock() {
  const now = useNow()

  return (
    <div>
      <p className="text-4xl font-semibold tabular-nums">
        {jakartaTime.format(now)} <span className="text-base text-muted-foreground">WIB</span>
      </p>
      <p className="text-sm text-muted-foreground">{jakartaLongDate.format(now)}</p>
    </div>
  )
}
