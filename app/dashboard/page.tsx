import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { AnimalPopulationChart } from "@/components/dashboard/animal-population-chart"
import { StatusStatisticsChart } from "@/components/dashboard/status-statistics-chart"
import { NotificationPanel } from "@/components/dashboard/notification-panel"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { SubscriptionStatus } from "@/components/dashboard/subscription-status"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardStats />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Animal Population</CardTitle>
            <CardDescription>Population changes over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <AnimalPopulationChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Status Statistics</CardTitle>
            <CardDescription>Current animal status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusStatisticsChart />
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
