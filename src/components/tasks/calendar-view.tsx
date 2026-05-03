"use client"

import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from "date-fns"
import { TaskPriority, type Task } from "@/src/app/[labId]/tasks/types"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { cn } from "@/src/lib/utils"
import { useMemo } from "react"

export type TasksCalendarViewProps = {
  month: Date
  onPrevMonth: () => void
  onNextMonth: () => void
  tasks: Task[]
  loading?: boolean
}

const PRIORITY_BAR: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: "border-l-green-500 bg-green-50",
  [TaskPriority.MEDIUM]: "border-l-amber-500 bg-amber-50",
  [TaskPriority.HIGH]: "border-l-orange-500 bg-orange-50",
  [TaskPriority.URGENT]: "border-l-red-600 bg-red-50",
}

function dayKey(d: Date): string {
  return format(d, "yyyy-MM-dd")
}

export default function TasksCalendarView(props: TasksCalendarViewProps) {
  const { month, onPrevMonth, onNextMonth, tasks, loading } = props

  const { gridDays, tasksByDay } = useMemo(() => {
    const monthStart = startOfMonth(month)
    const monthEnd = endOfMonth(month)
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd })
    const map = new Map<string, Task[]>()
    for (const t of tasks) {
      if (!t.dueDate) continue
      const k = dayKey(new Date(t.dueDate))
      const list = map.get(k) ?? []
      list.push(t)
      map.set(k, list)
    }
    return { gridDays, tasksByDay: map }
  }, [month, tasks])

  const today = new Date()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="outline" size="icon" onClick={onPrevMonth} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-medium tabular-nums">{format(month, "MMMM yyyy")}</h3>
        <Button type="button" variant="outline" size="icon" onClick={onNextMonth} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" aria-label="Loading calendar" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {day}
            </div>
          ))}

          {gridDays.map((day) => {
            const key = dayKey(day)
            const dayTasks = tasksByDay.get(key) ?? []
            const inMonth = isSameMonth(day, month)
            const isToday = isSameDay(day, today)

            return (
              <div
                key={key}
                className={cn(
                  "flex min-h-[5.5rem] flex-col rounded-md border p-1 text-left",
                  inMonth ? "bg-background" : "bg-muted/40 text-muted-foreground",
                  isToday && "ring-2 ring-primary ring-offset-2",
                )}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-semibold tabular-nums">{format(day, "d")}</span>
                  {dayTasks.length > 0 ? (
                    <Badge variant="secondary" className="h-5 min-w-[1.25rem] px-1 text-[10px] font-medium">
                      {dayTasks.length}
                    </Badge>
                  ) : null}
                </div>
                <div className="mt-1 flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto">
                  {dayTasks.slice(0, 4).map((task) => (
                    <div
                      key={task.id}
                      title={task.title}
                      className={cn(
                        "truncate rounded border-l-2 px-1 py-0.5 text-[10px] font-medium leading-tight sm:text-xs",
                        PRIORITY_BAR[task.priority] ?? "border-l-slate-400 bg-slate-50",
                      )}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 4 ? (
                    <span className="text-[10px] text-muted-foreground">+{dayTasks.length - 4} more</span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
