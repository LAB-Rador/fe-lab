"use client"

import { TaskPriority, TaskStatus, type AssigneeScopeFilter, type Task, type LaboratoryTasksPagination, type TaskPriorityFilterValue, type TaskStatusFilterValue } from "./types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import TasksNotifications, { type AppNotification } from "@/src/components/tasks/notifications"
import type { ExperimentTaskUpsertPayload } from "../experiments/[id]/tabs/experiment-tasks-tab"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ExperimentTasksTab } from "../experiments/[id]/tabs/experiment-tasks-tab"
import TasksCalendarView from "@/src/components/tasks/calendar-view"
import { Calendar, Filter } from "lucide-react"
import { capitalizeEnum } from "@/src/lib/strings"

export function TasksView(props: {
  userId: string
  initialNotifications: AppNotification[]
  mainTab: "list" | "calendar"
  onMainTabChange: (v: "list" | "calendar") => void
  assigneeFilter: AssigneeScopeFilter
  onAssigneeFilter: (v: AssigneeScopeFilter) => void
  statusFilter: TaskStatusFilterValue
  onStatusFilter: (v: TaskStatusFilterValue) => void
  priorityFilter: TaskPriorityFilterValue
  onPriorityFilter: (v: TaskPriorityFilterValue) => void
  calendarMonth: Date
  onCalendarPrevMonth: () => void
  onCalendarNextMonth: () => void
  calendarTasks: Task[]
  calendarLoading: boolean
  tasks: Task[]
  pagination: LaboratoryTasksPagination
  tasksLoading: boolean
  assignees: { id: string; label: string }[]
  onPaginationChange: (next: { page?: number; pageSize?: number }) => void | Promise<void>
  onCreateTask: (payload: ExperimentTaskUpsertPayload) => void | Promise<void>
  onUpdateTask: (taskId: string, payload: ExperimentTaskUpsertPayload) => void | Promise<void>
  onPatchTaskStatus: (taskId: string, status: TaskStatus) => void | Promise<void>
  onDeleteTask: (taskId: string) => void | Promise<void>
}) {
  const {
    userId,
    initialNotifications,
    mainTab,
    onMainTabChange,
    assigneeFilter,
    onAssigneeFilter,
    statusFilter,
    onStatusFilter,
    priorityFilter,
    onPriorityFilter,
    calendarMonth,
    onCalendarPrevMonth,
    onCalendarNextMonth,
    calendarTasks,
    calendarLoading,
    tasks,
    pagination,
    tasksLoading,
    assignees,
    onPaginationChange,
    onCreateTask,
    onUpdateTask,
    onPatchTaskStatus,
    onDeleteTask,
  } = props

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-4 md:col-span-2">
          <Tabs value={mainTab} onValueChange={(v) => onMainTabChange(v as "list" | "calendar")} className="w-full">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TabsList className="w-fit">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={assigneeFilter}
                  onValueChange={(v) => onAssigneeFilter(v as AssigneeScopeFilter)}
                >
                  <SelectTrigger className="h-9 w-[140px]" aria-label="Filter by assignment">
                    <Filter className="mr-2 h-4 w-4 shrink-0" aria-hidden />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="all">All tasks</SelectItem>
                    <SelectItem value="mine">My tasks</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={(v) => onStatusFilter(v as TaskStatusFilterValue)}>
                  <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by status">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="all">All statuses</SelectItem>
                    {Object.values(TaskStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {capitalizeEnum(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={priorityFilter}
                  onValueChange={(v) => onPriorityFilter(v as TaskPriorityFilterValue)}
                >
                  <SelectTrigger className="h-9 w-[150px]" aria-label="Filter by priority">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="all">All priorities</SelectItem>
                    {Object.values(TaskPriority).map((p) => (
                      <SelectItem key={p} value={p}>
                        {capitalizeEnum(p)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="list" className="mt-0 space-y-4">
              <ExperimentTasksTab
                surface="standalone"
                sectionTitle="Laboratory tasks"
                emptyListMessage="No laboratory tasks yet. Use Add Task to assign work that is not tied to a specific experiment."
                deleteScopeLabel="laboratory"
                noAssigneesLabel="No active laboratory members available."
                tasks={tasks}
                pagination={pagination}
                assignees={assignees}
                onPaginationChange={onPaginationChange}
                onPatchTaskStatus={onPatchTaskStatus}
                onCreateTask={onCreateTask}
                onUpdateTask={onUpdateTask}
                onDeleteTask={onDeleteTask}
                experimentsLoadingTasks={tasksLoading}
              />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center text-lg">
                    <Calendar className="mr-2 h-5 w-5" aria-hidden />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TasksCalendarView
                    month={calendarMonth}
                    onPrevMonth={onCalendarPrevMonth}
                    onNextMonth={onCalendarNextMonth}
                    tasks={calendarTasks}
                    loading={calendarLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <TasksNotifications userId={userId} initialItems={initialNotifications} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
