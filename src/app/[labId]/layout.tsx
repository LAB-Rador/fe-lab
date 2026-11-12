"use server"

import { DashboardHeader } from "@/src/components/dashboard/dashboard-header"
import type { AppNotification } from "@/src/components/tasks/notifications"
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { PlanAccessProvider } from "@/src/components/plan-access"
import { loadLaboratoryPlan } from "@/src/lib/paid-features"
import { SidebarProvider } from "@/src/components/sidebar-provider"
import { serverApiClient } from "@/src/lib/serverApiClient"
import { Sidebar } from "@/src/components/sidebar"
import type { Laboratory } from "../account/types"
import { redirect } from 'next/navigation'
import type React from "react"


export default async function DashboardLayout({
  children,
  params
}: {
  params: {labId: string},
  children: React.ReactNode
}) {
  const {labId} = await params;
  const userId = await getServerAuthenticatedUserId()
  
  const laboratories = await serverApiClient.get(`/api/laboratories/${userId}`)
  const laboratory = laboratories.data.find((item: Laboratory) => item.slug === labId)
  if (!laboratory) {
    redirect("/account")
  }

  const [laboratoryMembers, plan] = await Promise.all([
    serverApiClient.get(`/api/laboratory/${userId}/${labId}`),
    loadLaboratoryPlan(userId, labId),
  ])
  const paidFeatures = plan.paidFeatures

  let unreadNotificationsCount = 0
  let initialUnreadNotifications: AppNotification[] = []
  if (paidFeatures) {
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
  }

  return (
    <PlanAccessProvider paidFeatures={paidFeatures}>
    <SidebarProvider>
      <div className="clinical-app flex min-h-screen bg-gray-50">
        <Sidebar laboratoryName={laboratory.name} />
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
    </PlanAccessProvider>
  )
}
