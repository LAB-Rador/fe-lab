import { Badge } from "@/src/components/ui/badge"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { AlertTriangle, Info, CheckCircle } from "lucide-react"

type NotificationType = "alert" | "info" | "success"

interface Notification {
  id: string
  type: NotificationType
  message: string
  time: string
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "alert",
    message: "Mouse ID-1234 showing abnormal behavior",
    time: "10 minutes ago",
  },
  {
    id: "2",
    type: "alert",
    message: "Temperature in Room B exceeds threshold",
    time: "25 minutes ago",
  },
  {
    id: "3",
    type: "info",
    message: "Experiment #42 scheduled for tomorrow",
    time: "1 hour ago",
  },
  {
    id: "4",
    type: "success",
    message: "Weekly health check completed",
    time: "2 hours ago",
  },
  {
    id: "5",
    type: "info",
    message: "New animal shipment arriving tomorrow",
    time: "3 hours ago",
  },
]

export function NotificationPanel() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
          >
            <div className="mt-0.5">
              {notification.type === "alert" && <AlertTriangle className="h-5 w-5 text-red-500" />}
              {notification.type === "info" && <Info className="h-5 w-5 text-blue-500" />}
              {notification.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{notification.message}</p>
                <Badge
                  variant="outline"
                  className={
                    notification.type === "alert"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : notification.type === "info"
                        ? "border-blue-200 bg-blue-50 text-blue-700"
                        : "border-green-200 bg-green-50 text-green-700"
                  }
                >
                  {notification.type}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">{notification.time}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
