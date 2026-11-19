export type AdminNotification = {
  id: string
  employeeId: string
  name: string
  changes: ('phone' | 'photo' | 'password')[]
  at: string
}

export function describeNotification({
  name,
  changes,
}: Pick<AdminNotification, 'name' | 'changes'>) {
  return `${name} changed their ${changes.join(', ')}`
}

export const notificationTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Jakarta',
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})
