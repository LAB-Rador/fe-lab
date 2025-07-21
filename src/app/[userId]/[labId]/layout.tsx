import { DashboardHeader } from "@/src/components/dashboard/dashboard-header"
import { SidebarProvider } from "@/src/components/sidebar-provider"
import { Sidebar } from "@/src/components/sidebar"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
