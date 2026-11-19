import { type Attendance, formatTime } from '@/lib/attendance'

export function AttendanceTimes({ attendance }: { attendance: Attendance }) {
  return (
    <dl className="flex justify-center gap-8 text-sm">
      <div>
        <dt className="text-muted-foreground">Clock in</dt>
        <dd className="font-medium tabular-nums">{formatTime(attendance.clockInAt)}</dd>
      </div>
      <div>
        <dt className="text-muted-foreground">Clock out</dt>
        <dd className="font-medium tabular-nums">{formatTime(attendance.clockOutAt)}</dd>
      </div>
    </dl>
  )
}
