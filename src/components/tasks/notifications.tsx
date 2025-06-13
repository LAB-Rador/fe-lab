import { Badge } from "@/src/components/ui/badge"
import { Bell, Calendar, CheckCircle, AlertTriangle, Clock } from "lucide-react"

const notifications = [
    {
        id: 1,
        type: "task_assigned",
        message: "Dr. Smith assigned you to 'Mouse colony health check'",
        time: "10 minutes ago",
        icon: <Calendar className="h-4 w-4 text-primary" />,
    },
    {
        id: 2,
        type: "task_completed",
        message: "Bird feeding schedule update has been completed",
        time: "1 hour ago",
        icon: <CheckCircle className="h-4 w-4 text-status-green" />,
    },
    {
        id: 3,
        type: "task_due_soon",
        message: "Laboratory equipment maintenance is due in 2 days",
        time: "2 hours ago",
        icon: <Clock className="h-4 w-4 text-status-yellow" />,
    },
    {
        id: 4,
        type: "task_overdue",
        message: "Animal welfare assessment is overdue",
        time: "3 hours ago",
        icon: <AlertTriangle className="h-4 w-4 text-status-red" />,
    },
    {
        id: 5,
        type: "task_assigned",
        message: "You were assigned to 'Inventory restocking'",
        time: "5 hours ago",
        icon: <Calendar className="h-4 w-4 text-primary" />,
    },
]

export default function TasksNotifications() {
    return (
        <div className="space-y-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            <span className="font-medium">Recent Updates</span>
            </div>
            <Badge className="bg-primary">{notifications.length}</Badge>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {notifications.map((notification) => (
            <div key={notification.id} className="flex gap-3 p-3 rounded-md border bg-white hover:bg-gray-50">
                <div className="mt-0.5">{notification.icon}</div>
                <div className="space-y-1">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.time}</p>
                </div>
            </div>
            ))}
        </div>
        </div>
    )
}
