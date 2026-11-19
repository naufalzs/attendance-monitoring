import { signInWithCustomToken } from 'firebase/auth'
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api, getErrorMessage } from '@/lib/api'
import { firebaseAuth, firestore } from '@/lib/firebase'
import { type AdminNotification, describeNotification } from '@/lib/notifications'

const LIMIT = 20
const SEEN_KEY = 'notificationsSeenAt'

export function useNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>()
  const [seenAt, setSeenAt] = useState(() => localStorage.getItem(SEEN_KEY) ?? '')

  useEffect(() => {
    let cancelled = false
    let unsubscribe: (() => void) | undefined

    async function listen() {
      const { data } = await api.get<{ token: string }>('/auth/firebase-token')
      await signInWithCustomToken(firebaseAuth, data.token)
      if (cancelled) return

      let initial = true
      unsubscribe = onSnapshot(
        query(collection(firestore, 'notifications'), orderBy('createdAt', 'desc'), limit(LIMIT)),
        (snapshot) => {
          setNotifications(
            snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }) as AdminNotification),
          )
          if (!initial) {
            for (const change of snapshot.docChanges()) {
              if (change.type === 'added') {
                toast.info(describeNotification(change.doc.data() as AdminNotification))
              }
            }
          }
          initial = false
        },
        () => toast.error("Couldn't load notifications."),
      )
    }

    listen().catch((error) => toast.error(getErrorMessage(error)))
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  const unread = notifications?.filter((notification) => notification.at > seenAt).length ?? 0

  function markSeen() {
    const latest = notifications?.[0]?.at
    if (!latest) return
    localStorage.setItem(SEEN_KEY, latest)
    setSeenAt(latest)
  }

  return { notifications, unread, markSeen }
}
