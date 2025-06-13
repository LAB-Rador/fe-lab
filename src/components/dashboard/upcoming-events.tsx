import { ScrollArea } from "@/src/components/ui/scroll-area"
import { Badge } from "@/src/components/ui/badge"
import { Calendar, Beaker, ClipboardList, Truck } from "lucide-react"

interface Event {
  id: string
  title: string
  type: "experiment" | "task" | "delivery" | "other"
  date: string
  time: string
}

const events: Event[] = [
  {
    id: "1",
    title: "Experiment #42 - Phase 2",
    type: "experiment",
    date: "Today",
    time: "10:00 AM",
  },
  {
    id: "2",
    title: "Weekly health check - Room A",
    type: "task",
    date: "Today",
    time: "2:00 PM",
  },
  {
    id: "3",
    title: "New mice delivery",
    type: "delivery",
    date: "Tomorrow",
    time: "9:30 AM",
  },
  {
    id: "4",
    title: "Experiment #45 - Initial setup",
    type: "experiment",
    date: "Jan 22, 2025",
    time: "11:00 AM",
  },
  {
    id: "5",
    title: "Monthly team meeting",
    type: "other",
    date: "Jan 23, 2025",
    time: "3:00 PM",
  },
]

export function UpcomingEvents() {
  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 rounded-lg border border-gray-100 bg-white p-3 shadow-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              {event.type === "experiment" && <Beaker className="h-5 w-5 text-purple-600" />}
              {event.type === "task" && <ClipboardList className="h-5 w-5 text-yellow-600" />}
              {event.type === "delivery" && <Truck className="h-5 w-5 text-green-600" />}
              {event.type === "other" && <Calendar className="h-5 w-5 text-blue-600" />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{event.title}</p>
                <Badge
                  variant="outline"
                  className={
                    event.type === "experiment"
                      ? "border-purple-200 bg-purple-50 text-purple-700"
                      : event.type === "task"
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                        : event.type === "delivery"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-blue-200 bg-blue-50 text-blue-700"
                  }
                >
                  {event.type}
                </Badge>
              </div>
              <div className="mt-1 flex items-center text-xs text-gray-500">
                <Calendar className="mr-1 h-3 w-3" />
                {event.date} at {event.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
