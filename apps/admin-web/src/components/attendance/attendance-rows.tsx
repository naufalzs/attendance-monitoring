import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { type Attendance, formatDay, formatTime } from '@/lib/attendance'
import { cn } from '@/lib/utils'

export function AttendanceRows({ rows, loading }: { rows: Attendance[]; loading: boolean }) {
  if (loading) {
    return Array.from({ length: 5 }, (_, index) => (
      <TableRow key={index}>
        <TableCell>
          <Skeleton className="h-5 w-24" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-28" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-16" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-5 w-16" />
        </TableCell>
      </TableRow>
    ))
  }

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
          No attendance this month.
        </TableCell>
      </TableRow>
    )
  }

  return rows.map((row) => (
    <TableRow
      key={row.id}
      className={cn(
        'even:bg-muted hover:bg-accent',
        !row.clockOutAt && 'bg-destructive/10 even:bg-destructive/10 hover:bg-destructive/15',
      )}
    >
      <TableCell className="font-medium">{row.employee.name}</TableCell>
      <TableCell>{formatDay(row.date)}</TableCell>
      <TableCell className="tabular-nums">{formatTime(row.clockInAt)}</TableCell>
      <TableCell className="tabular-nums">{formatTime(row.clockOutAt)}</TableCell>
    </TableRow>
  ))
}
