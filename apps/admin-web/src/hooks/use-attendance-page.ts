import useSWR from 'swr'
import type { Attendance, Paginated } from '@/lib/attendance'

const PAGE_SIZE = 20

export function useAttendancePage(page: number) {
  const { data, isLoading, isValidating } = useSWR<Paginated<Attendance>>(
    ['/attendance', { page, limit: PAGE_SIZE }],
    { keepPreviousData: true },
  )

  return {
    rows: data?.data ?? [],
    totalPages: data ? Math.max(1, Math.ceil(data.total / data.limit)) : 1,
    isLoading: isLoading && !data,
    isValidating,
  }
}
