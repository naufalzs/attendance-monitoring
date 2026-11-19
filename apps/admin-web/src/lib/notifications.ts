export type AdminNotification = {
  id: string
  employeeId: string
  name: string
  changes: ('phone' | 'photo' | 'password')[]
  at: string
}

const CHANGE_LABELS: Record<AdminNotification['changes'][number], string> = {
  phone: 'phone number',
  photo: 'photo',
  password: 'password',
}

export function describeNotification({
  name,
  changes,
}: Pick<AdminNotification, 'name' | 'changes'>) {
  return `${name} changed their ${changes.map((change) => CHANGE_LABELS[change]).join(', ')}`
}

export const notificationTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})
