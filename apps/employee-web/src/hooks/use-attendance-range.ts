import useSWR from 'swr'
import { type Attendance, attendanceKey } from '@/lib/attendance'

export function useAttendanceRange(from: string, to: string) {
  const { data, isLoading, isValidating, mutate } = useSWR<Attendance[]>(attendanceKey(from, to), {
    keepPreviousData: true,
  })

  return { rows: data ?? [], isLoading, isValidating, refresh: mutate }
}
