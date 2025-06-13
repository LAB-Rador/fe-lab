"use client"

import { useState } from "react"
import { Badge } from "@/src/components/ui/badge"
import { Button } from "@/src/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Sample calendar data
const calendarData = [
    { date: 1, tasks: [] },
    { date: 2, tasks: [] },
    { date: 3, tasks: [{ id: 4, name: "Laboratory equipment maintenance", priority: "High" }] },
    { date: 4, tasks: [{ id: 7, name: "Animal welfare assessment", priority: "High" }] },
    { date: 5, tasks: [{ id: 1, name: "Mouse colony health check", priority: "High" }] },
    { date: 6, tasks: [] },
    { date: 7, tasks: [{ id: 2, name: "Fish tank water quality test", priority: "Medium" }] },
    { date: 8, tasks: [{ id: 5, name: "Experiment data collection", priority: "Medium" }] },
    { date: 9, tasks: [] },
    { date: 10, tasks: [{ id: 3, name: "Bird feeding schedule update", priority: "Low" }] },
    { date: 11, tasks: [] },
    { date: 12, tasks: [{ id: 6, name: "Inventory restocking", priority: "Medium" }] },
    { date: 13, tasks: [] },
    { date: 14, tasks: [] },
    { date: 15, tasks: [] },
    { date: 16, tasks: [] },
    { date: 17, tasks: [] },
    { date: 18, tasks: [] },
    { date: 19, tasks: [] },
    { date: 20, tasks: [] },
    { date: 21, tasks: [] },
    { date: 22, tasks: [] },
    { date: 23, tasks: [] },
    { date: 24, tasks: [] },
    { date: 25, tasks: [] },
    { date: 26, tasks: [] },
    { date: 27, tasks: [] },
    { date: 28, tasks: [] },
    { date: 29, tasks: [] },
    { date: 30, tasks: [] },
]

export default function TasksCalendarView() {
    const [currentMonth, setCurrentMonth] = useState("June 2025")

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-medium">{currentMonth}</h3>
                <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-2 text-sm font-medium text-gray-500">
                    {day}
                </div>
                ))}

                {/* Empty cells for days before the 1st of the month */}
                {Array.from({ length: 6 }).map((_, index) => (
                <div key={`empty-${index}`} className="h-24 border rounded-md bg-gray-50"></div>
                ))}

                {calendarData.map((day) => (
                <div
                    key={day.date}
                    className={`h-24 border rounded-md p-1 overflow-hidden ${
                    day.date === new Date().getDate() ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                >
                    <div className="flex justify-between items-start">
                    <span className="text-sm font-medium">{day.date}</span>
                    {day.tasks.length > 0 && <Badge className="bg-primary">{day.tasks.length}</Badge>}
                    </div>
                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[calc(100%-20px)]">
                    {day.tasks.map((task) => (
                        <CalendarTask key={task.id} task={task} />
                    ))}
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

function CalendarTask({ task }: { task: { id: number; name: string; priority: string } }) {
    const priorityColors = {
        High: "bg-status-red/20 border-l-status-red",
        Medium: "bg-status-yellow/20 border-l-status-yellow",
        Low: "bg-status-green/20 border-l-status-green",
    }

    return (
        <div
        className={`text-xs p-1 rounded border-l-2 truncate ${
            priorityColors[task.priority as keyof typeof priorityColors]
        }`}
        >
        {task.name}
        </div>
    )
}
