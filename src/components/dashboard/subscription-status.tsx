import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Progress } from "@/src/components/ui/progress"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

export function SubscriptionStatus() {
  return (
    <Card className="w-[315px] md:w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>Your current plan and usage</CardDescription>
          </div>
          <Badge className="bg-blue-600">Standard Plan</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Users</h4>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">8/10</p>
              <span className="text-xs text-gray-500">80%</span>
            </div>
            <Progress value={80} className="h-2" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Storage</h4>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">45/100 GB</p>
              <span className="text-xs text-gray-500">45%</span>
            </div>
            <Progress value={45} className="h-2" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Animals</h4>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">1,248/2,000</p>
              <span className="text-xs text-gray-500">62%</span>
            </div>
            <Progress value={62} className="h-2" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-500">Experiments</h4>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold">24/50</p>
              <span className="text-xs text-gray-500">48%</span>
            </div>
            <Progress value={48} className="h-2" />
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2 items-center justify-between">
          <div>
            <p className="text-sm font-medium">Next billing date: February 15, 2025</p>
            <p className="text-xs text-gray-500">Your plan renews automatically</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Manage Subscription</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Upgrade Plan
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
