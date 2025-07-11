import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { AnimalPopulationChart } from "@/src/components/dashboard/animal-population-chart"
import { StatusStatisticsChart } from "@/src/components/dashboard/status-statistics-chart"
import { SubscriptionStatus } from "@/src/components/dashboard/subscription-status"
import { NotificationPanel } from "@/src/components/dashboard/notification-panel"
import { DashboardStatus } from "@/src/components/dashboard/dashboard-status"
import { UpcomingEvents } from "@/src/components/dashboard/upcoming-events"
import type { DashboardViewProps } from "./types"

export default function DashboardView({animals, experiments, tasks, previousMonthData}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardStatus 
        previousMonthData={previousMonthData}
        experiments={experiments}
        animals={animals}
        tasks={tasks}
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Animal Population</CardTitle>
            <CardDescription>Population changes over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimalPopulationChart animals={animals} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Status Statistics</CardTitle>
            <CardDescription>Current animal status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusStatisticsChart animals={animals} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Scheduled events for the next 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <UpcomingEvents />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Recent alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationPanel />
          </CardContent>
        </Card>
      </div>
      <SubscriptionStatus />
    </div>
  )
}
