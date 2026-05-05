"use server"

import { DashboardHeader } from "@/src/components/dashboard/dashboard-header"
import { SidebarProvider } from "@/src/components/sidebar-provider"
import { Sidebar } from "@/src/components/sidebar"
import type { Laboratory } from "../account/types"
import type { AppNotification } from "@/src/components/tasks/notifications"
import { serverApiClient } from "@/src/lib/serverApiClient"

import { redirect } from 'next/navigation'
import { cookies } from "next/headers"
import type React from "react"

export default async function DashboardLayout({
  children,
  params
}: {
  params: {labId: string},
  children: React.ReactNode
}) {
  const { labId } = await params
  const cookieStore = await cookies()
  const userId = await cookieStore.get("USER_ID")?.value || "default"
  const laboratories = await serverApiClient.get(`/api/laboratories/${userId}`);
  const laboratory = await laboratories.data.find((laboratory: Laboratory) => laboratory.name === labId);
  const laboratoryMembers = await serverApiClient.get(`/api/laboratory/${userId}/${labId}`);

  let unreadNotificationsCount = 0
  let initialUnreadNotifications: AppNotification[] = []
  try {
    const notifQs = new URLSearchParams({ limit: "100", labId, onlyUnread: "true" }).toString()
    const notifRes = (await serverApiClient.get(`/api/users/${userId}/notifications?${notifQs}`)) as
      | { success?: boolean; data?: AppNotification[] }
      | undefined
    if (notifRes?.success && Array.isArray(notifRes.data)) {
      initialUnreadNotifications = notifRes.data
      unreadNotificationsCount = initialUnreadNotifications.length
    }
  } catch {
    unreadNotificationsCount = 0
    initialUnreadNotifications = []
  }

  if(!laboratory) {
    redirect('/account');
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader
            laboratoryMembers={laboratoryMembers.data}
            unreadNotificationsCount={unreadNotificationsCount}
            initialUnreadNotifications={initialUnreadNotifications}
            userId={userId}
            labId={labId}
          />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
