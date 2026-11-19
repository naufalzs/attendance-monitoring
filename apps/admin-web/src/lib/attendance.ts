export type Attendance = {
  id: string
  date: string
  clockInAt: string
  clockOutAt: string | null
  employee: { id: string; name: string }
}

export type Paginated<T> = {
  data: T[]
  total: number
  page: number
  limit: number
}

const TIME_ZONE = 'Asia/Jakarta'

export const jakartaTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

export const jakartaLongDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export function formatDay(date: string) {
  return dayFormat.format(new Date(`${date}T00:00:00Z`))
}

export function formatTime(iso: string | null) {
  return iso ? jakartaTime.format(new Date(iso)) : '—'
}
