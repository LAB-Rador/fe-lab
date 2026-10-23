import type { UpcomingEvent } from "@/src/app/[labId]/dashboard/types"
import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Badge } from "@/src/components/ui/badge"
import { Calendar, Beaker, ClipboardList } from "lucide-react"

function formatWhen(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const day = new Date(date)
    day.setHours(0, 0, 0, 0)
    const diffDays = Math.round((day.getTime() - start.getTime()) / 86400000)
    const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    if (diffDays === 0) return `Today, ${time}`
    if (diffDays === 1) return `Tomorrow, ${time}`
    const dayLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    return `${dayLabel}, ${time}`
}

export function UpcomingEvents({ events }: { events: UpcomingEvent[] }) {
    return (
        <ScrollArea className="h-[300px]">
            {events.length === 0 ? (
                <p className="text-sm text-gray-500">No events in the next 7 days.</p>
            ) : (
                <div className="space-y-4">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
                                {event.type === "experiment" ? (
                                    <Beaker className="h-5 w-5 text-purple-600" />
                                ) : (
                                    <ClipboardList className="h-5 w-5 text-yellow-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">{event.title}</p>
                                    <Badge
                                        variant="outline"
                                        className={
                                            event.type === "experiment"
                                                ? "border-purple-200 bg-purple-50 text-purple-700"
                                                : "border-yellow-200 bg-yellow-50 text-yellow-700"
                                        }
                                    >
                                        {event.type === "experiment" ? "Experiment" : "Task"}
                                    </Badge>
                                </div>
                                <div className="mt-1 flex items-center text-xs text-gray-500">
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {formatWhen(event.date)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ScrollArea>
    )
}
