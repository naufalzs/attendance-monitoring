import { toast } from 'sonner'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'
import { api, getErrorMessage } from '@/lib/api'
import { type Attendance, attendanceKey, todayInJakarta } from '@/lib/attendance'

export function useTodayAttendance() {
  const date = todayInJakarta()
  const { mutate } = useSWRConfig()
  const { data, mutate: setRows } = useSWR<Attendance[]>(attendanceKey(date, date))
  const today = data && (data[0] ?? null)
  const action = today ? 'clock-out' : 'clock-in'
  const { trigger, isMutating } = useSWRMutation(`/attendance/${action}`, (url: string) =>
    api.post<Attendance>(url).then(({ data }) => data),
  )

  async function clock() {
    try {
      const record = await trigger()
      await setRows([record], { revalidate: false })
      toast.success(action === 'clock-in' ? 'Clocked in' : 'Clocked out')
      void mutate((key) => Array.isArray(key) && key[0] === '/attendance/me')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return { today, clock, isClocking: isMutating }
}
