import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Attendance, formatDay, formatTime } from '@/lib/attendance'

export function AttendanceTable({ rows, loading }: { rows: Attendance[]; loading: boolean }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Clock in</TableHead>
          <TableHead>Clock out</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <SkeletonRows />
        ) : rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
              No attendance in this range.
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={row.id} className="even:bg-muted hover:bg-accent">
              <TableCell>{formatDay(row.date)}</TableCell>
              <TableCell className="tabular-nums">{formatTime(row.clockInAt)}</TableCell>
              <TableCell className="tabular-nums">{formatTime(row.clockOutAt)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

function SkeletonRows() {
  return Array.from({ length: 5 }, (_, index) => (
    <TableRow key={index}>
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
