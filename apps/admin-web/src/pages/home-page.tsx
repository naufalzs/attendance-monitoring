import { AttendanceTable } from '@/components/attendance-table'
import { LiveClock } from '@/components/live-clock'

export function HomePage() {
  return (
    <>
      <LiveClock />
      <AttendanceTable />
    </>
  )
}
