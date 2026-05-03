"use client"

import { Bell, FlaskConical, HeartPulse, Settings, ListTodo, Clock } from "lucide-react"
import { decreaseUnread } from "@/src/redux/slices/notificationsSlice"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Badge } from "@/src/components/ui/badge"
import { useAppDispatch } from "@/src/lib/hooks"
import { apiClient } from "@/src/lib/apiClient"

export type AppNotification = {
  id: string
  userId: string
  laboratoryId?: string
  title: string
  message: string
  isRead: boolean
  type: string
  createdAt?: string
}

export function notificationsQueryParams(labId: string, limit?: number, onlyUnread?: boolean): string {
  const q = new URLSearchParams()
  q.set("labId", labId)
  if (limit !== undefined) q.set("limit", String(limit))
  if (onlyUnread) q.set("onlyUnread", "true")
  return q.toString()
}

export function formatNotificationWhen(iso: string | undefined): { line: string; dateTime: string } {
  if (!iso) return { line: "—", dateTime: "" }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { line: "—", dateTime: "" }
  return {
    line: new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(d),
    dateTime: d.toISOString(),
  }
}

export function typeIcon(type: string) {
  switch (type) {
    case "TASK":
      return <ListTodo className="h-5 w-5 text-blue-600" aria-hidden />
    case "EXPERIMENT":
      return <FlaskConical className="h-5 w-5 text-violet-600" aria-hidden />
    case "ANIMAL_ALERT":
      return <HeartPulse className="h-5 w-5 text-amber-600" aria-hidden />
    case "BREEDING":
      return <HeartPulse className="h-5 w-5 text-rose-600" aria-hidden />
    case "SYSTEM":
    default:
      return <Settings className="h-5 w-5 text-slate-600" aria-hidden />
  }
}

export default function TasksNotifications(props: { userId: string; labId: string; initialItems: AppNotification[] }) {
  const { userId, labId, initialItems } = props
  const dispatch = useAppDispatch()
  const [items, setItems] = useState<AppNotification[]>(initialItems)
  const [patchingId, setPatchingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function refresh() {
      try {
        const res = (await apiClient.get(
          `/api/users/${userId}/notifications?${notificationsQueryParams(labId, 40)}`,
        )) as
          | { success?: boolean; data?: AppNotification[] }
          | undefined
        if (cancelled) return
        if (res?.success && Array.isArray(res.data)) {
          setItems(res.data)
        }
      } catch {
        /* keep SSR list */
      }
    }
    void refresh()
    return () => {
      cancelled = true
    }
  }, [userId, labId])

  const unreadCount = useMemo(() => items.filter((n) => !n.isRead).length, [items])

  const markRead = useCallback(
    async (id: string) => {
      if (patchingId) return
      const row = items.find((n) => n.id === id)
      if (!row || row.isRead) return
      setPatchingId(id)
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
      try {
        const res = (await apiClient.patch(
          `/api/users/${userId}/notifications/${id}/read?${notificationsQueryParams(labId)}`,
          {},
        )) as {
          success?: boolean
        }
        if (res?.success) {
          dispatch(decreaseUnread(1))
        } else {
          setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)))
        }
      } catch {
        setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)))
      } finally {
        setPatchingId(null)
      }
    },
    [dispatch, items, patchingId, userId, labId],
  )

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No notifications yet.</p>
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Bell className="h-4 w-4" aria-hidden />
          Latest updates
        </span>
        {unreadCount > 0 ? (
          <Badge variant="secondary" className="font-normal">
            {unreadCount} unread
          </Badge>
        ) : null}
      </div>
      <ul className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
        {items.map((notification) => {
          const when = formatNotificationWhen(notification.createdAt)
          return (
            <li key={notification.id}>
              <button
                type="button"
                onClick={() => void markRead(notification.id)}
                className={`flex w-full gap-3 rounded-md border p-3 text-left transition-colors hover:bg-muted/60 ${
                  notification.isRead ? "bg-background" : "border-primary/30 bg-primary/5"
                }`}
              >
                <div className="mt-0.5 shrink-0">{typeIcon(notification.type)}</div>
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="text-sm font-medium leading-snug text-foreground">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="flex items-center gap-1.5 pt-0.5 text-xs text-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    <span className="font-medium text-foreground">Received</span>
                    <time
                      dateTime={when.dateTime || undefined}
                      className="tabular-nums text-foreground"
                      title={when.dateTime || undefined}
                    >
                      {when.line}
                    </time>
                  </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
