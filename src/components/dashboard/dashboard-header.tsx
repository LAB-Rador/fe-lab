"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import type { InitialMembersTypes } from "@/src/app/[labId]/team/types"
import { decreaseUnread, setUnreadCount } from "@/src/redux/slices/notificationsSlice"
import { useAppDispatch, useAppSelector } from "@/src/lib/hooks"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Badge } from "@/src/components/ui/badge"
import { getInitials } from "@/src/lib/utils"
import type { AppNotification } from "@/src/components/tasks/notifications"
import {
  formatNotificationWhen,
  notificationsQueryParams,
  typeIcon,
} from "@/src/components/tasks/notifications"
import { apiClient } from "@/src/lib/apiClient"
import { Bell, Clock, Search } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"

export function DashboardHeader({
  laboratoryMembers,
  userId,
  labId,
  initialUnreadNotifications = [],
  unreadNotificationsCount = 0,
}: {
  laboratoryMembers: InitialMembersTypes[]
  userId: string
  labId: string
  initialUnreadNotifications?: AppNotification[]
  unreadNotificationsCount?: number
}) {
  const dispatch = useAppDispatch()
  const unreadFromRedux = useAppSelector((s) => s.notifications.unreadCount)
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)
  const [unreadItems, setUnreadItems] = useState<AppNotification[]>(initialUnreadNotifications)
  const [patchingId, setPatchingId] = useState<string | null>(null)

  useLayoutEffect(() => {
    dispatch(setUnreadCount(unreadNotificationsCount))
  }, [dispatch, unreadNotificationsCount])

  useEffect(() => {
    setUnreadItems(initialUnreadNotifications)
  }, [initialUnreadNotifications])

  useEffect(() => {
    if (!notifMenuOpen) return
    let cancelled = false
    async function loadUnread() {
      try {
        const res = (await apiClient.get(
          `/api/users/${userId}/notifications?${notificationsQueryParams(labId, 40, true)}`,
        )) as { success?: boolean; data?: AppNotification[] } | undefined
        if (cancelled) return
        if (res?.success && Array.isArray(res.data)) {
          setUnreadItems(res.data)
          dispatch(setUnreadCount(res.data.length))
        }
      } catch {
        /* keep current list */
      }
    }
    void loadUnread()
    return () => {
      cancelled = true
    }
  }, [notifMenuOpen, userId, labId, dispatch])

  const markRead = useCallback(
    async (notificationId: string) => {
      if (patchingId) return
      const row = unreadItems.find((n) => n.id === notificationId)
      if (!row || row.isRead) return
      setPatchingId(notificationId)
      setUnreadItems((prev) => prev.filter((n) => n.id !== notificationId))
      try {
        const res = (await apiClient.patch(
          `/api/users/${userId}/notifications/${notificationId}/read?${notificationsQueryParams(labId)}`,
          {},
        )) as { success?: boolean }
        if (res?.success) {
          dispatch(decreaseUnread(1))
        } else {
          setUnreadItems((prev) => [row, ...prev])
        }
      } catch {
        setUnreadItems((prev) => [row, ...prev])
      } finally {
        setPatchingId(null)
      }
    },
    [dispatch, patchingId, unreadItems, userId, labId],
  )

    return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <form className="hidden md:block md:flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-gray-50 pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <div className="flex items-center gap-4">
        <div className="*:data-[slot=avatar]:ring-background flex space-x-1 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
          {laboratoryMembers.map((member) => {
            return (
              <DropdownMenu key={member.id}>
                <DropdownMenuTrigger asChild>
                  <Button disabled variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-white text-lg font-semibold">
                          {getInitials(member.user.firstName || "", member.user.lastName || "")}
                        </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
        </div>
        <DropdownMenu open={notifMenuOpen} onOpenChange={setNotifMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" type="button" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {unreadFromRedux > 0 ? (
                <Badge className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 p-0 text-xs text-white">
                  {unreadFromRedux > 99 ? "99+" : unreadFromRedux}
                </Badge>
              ) : null}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0" onCloseAutoFocus={(e) => e.preventDefault()}>
            <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold">New notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {unreadItems.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">No new notifications.</div>
            ) : (
              <div className="max-h-80 overflow-y-auto py-1">
                {unreadItems.map((notification) => {
                  const when = formatNotificationWhen(notification.createdAt)
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      className="cursor-pointer items-start gap-2 rounded-none px-3 py-2 focus:bg-primary/5"
                      onSelect={(e) => {
                        e.preventDefault()
                        void markRead(notification.id)
                      }}
                    >
                      <div className="mt-0.5 shrink-0">{typeIcon(notification.type)}</div>
                      <div className="min-w-0 flex-1 space-y-0.5 text-left">
                        <p className="text-sm font-medium leading-snug">{notification.title}</p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{notification.message}</p>
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" aria-hidden />
                          <time dateTime={when.dateTime || undefined} title={when.dateTime || undefined}>
                            {when.line}
                          </time>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  )
                })}
              </div>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={`/${labId}/tasks`} className="w-full justify-center text-center font-medium">
                View all in Tasks
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
