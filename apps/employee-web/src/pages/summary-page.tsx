import { useSearchParams } from 'react-router'
import {
  type AttendanceFilter,
  AttendanceFilterForm,
} from '@/components/attendance/attendance-filter-form'
import { AttendanceTable } from '@/components/attendance/attendance-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAttendanceRange } from '@/hooks/use-attendance-range'
import { todayInJakarta } from '@/lib/attendance'
import { cn } from '@/lib/utils'

export function SummaryPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const today = todayInJakarta()
  const from = searchParams.get('from') ?? `${today.slice(0, 8)}01`
  const to = searchParams.get('to') ?? today
  const { rows, isLoading, isValidating, refresh } = useAttendanceRange(from, to)

  function search(filter: AttendanceFilter) {
    if (filter.from === from && filter.to === to) refresh()
    else setSearchParams(filter)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance summary</CardTitle>
      </CardHeader>
      <CardContent className={cn('grid gap-4', isValidating && 'cursor-wait')}>
        <AttendanceFilterForm value={{ from, to }} searching={isValidating} onSearch={search} />
        <AttendanceTable rows={rows} loading={isLoading} />
      </CardContent>
    </Card>
  )
}
