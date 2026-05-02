"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { FileText, Microscope, Stethoscope, Weight } from "lucide-react"

export function QuickActionRecentActivityCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ActivityItem
          icon={Weight}
          title="Weight Measurement"
          description="Recorded by Dr. Johnson"
          time="Today, 9:45 AM"
        />

        <ActivityItem
          icon={Stethoscope}
          title="Health Check"
          description="Performed by Dr. Smith"
          time="Yesterday, 2:30 PM"
        />

        <ActivityItem
          icon={Microscope}
          title="Blood Sample"
          description="Collected for EXP-2024-001"
          time="Mar 10, 11:15 AM"
        />

        <ActivityItem
          icon={FileText}
          title="Observation Added"
          description="Behavior notes updated"
          time="Mar 8, 4:20 PM"
        />

        <Button variant="link" className="w-full text-blue-600 hover:text-blue-700 p-0 h-auto">
          View all activity
        </Button>
      </CardContent>
    </Card>
  )
}

interface ActivityItemProps {
  icon: React.ElementType
  title: string
  description: string
  time: string
}

function ActivityItem({ icon: Icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-blue-50 rounded-full p-1.5">
        <Icon className="h-3.5 w-3.5 text-blue-600" />
      </div>
      <div className="flex-1 space-y-1">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  )
}
