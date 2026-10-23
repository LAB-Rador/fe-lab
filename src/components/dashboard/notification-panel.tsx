import type { AppNotification } from "@/src/components/tasks/notifications"
import { formatNotificationWhen, typeIcon } from "@/src/components/tasks/notifications"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Badge } from "@/src/components/ui/badge"

function typeLabel(type: string) {
    switch (type) {
        case "TASK":
            return "Task"
        case "EXPERIMENT":
            return "Experiment"
        case "ANIMAL_ALERT":
            return "Animal alert"
        case "BREEDING":
            return "Breeding"
        default:
            return "System"
    }
}

export function NotificationPanel({ notifications }: { notifications: AppNotification[] }) {
    return (
        <ScrollArea className="h-[300px]">
            {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications yet.</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => {
                        const when = formatNotificationWhen(notification.createdAt)
                        return (
                            <div
                                key={notification.id}
                                className={`flex items-start gap-3 rounded-lg border bg-white p-3 shadow-sm ${
                                    notification.isRead ? "border-gray-100" : "border-primary/30"
                                }`}
                            >
                                <div className="mt-0.5 shrink-0">{typeIcon(notification.type)}</div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-sm font-medium">{notification.title}</p>
                                        <Badge variant="outline">{typeLabel(notification.type)}</Badge>
                                    </div>
                                    {notification.message ? (
                                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">{notification.message}</p>
                                    ) : null}
                                    <p className="mt-1 text-xs text-gray-500">{when.line}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </ScrollArea>
    )
}
