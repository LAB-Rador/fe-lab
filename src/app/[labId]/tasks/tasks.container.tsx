"use client"

import { TaskStatus, type Task, type AssigneeScopeFilter, type TaskStatusFilterValue, type TaskPriorityFilterValue, type LaboratoryTasksPagePayload, type LaboratoryTasksPagination } from "./types"
import type { ExperimentTaskAssigneeOption, ExperimentTaskUpsertPayload } from "../experiments/[id]/tabs/experiment-tasks-tab"
import type { AppNotification } from "@/src/components/tasks/notifications"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import type { InitialMembersTypes } from "../team/types"
import { endOfMonth, startOfMonth } from "date-fns"
import { apiClient } from "@/src/lib/apiClient"
import { TasksView } from "./tasks.view"
import { toast } from "sonner"

const DEFAULT_PAGINATION: LaboratoryTasksPagination = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 10,
  totalCount: 0,
  hasPreviousPage: false,
  hasNextPage: false,
}

function buildLabTasksQuery(parts: {
  page: number
  pageSize: number
  status: TaskStatusFilterValue
  priority: TaskPriorityFilterValue
  assigneeScope: AssigneeScopeFilter
  dueDateFrom?: string
  dueDateTo?: string
}): string {
  const q = new URLSearchParams()
  q.set("page", String(parts.page))
  q.set("pageSize", String(parts.pageSize))
  if (parts.status !== "all") q.set("status", parts.status)
  if (parts.priority !== "all") q.set("priority", parts.priority)
  if (parts.assigneeScope === "mine") q.set("assigneeScope", "me")
  if (parts.dueDateFrom) q.set("dueDateFrom", parts.dueDateFrom)
  if (parts.dueDateTo) q.set("dueDateTo", parts.dueDateTo)
  return q.toString()
}

function membersToAssignees(members: InitialMembersTypes[]): ExperimentTaskAssigneeOption[] {
  const out: ExperimentTaskAssigneeOption[] = []
  for (const m of members) {
    if (m.accessStatus !== "ACTIVE") continue
    const composed = [m.user.firstName, m.user.lastName].filter(Boolean).join(" ").trim()
    const label = composed || m.user.email || m.userId
    out.push({ id: m.userId, label })
  }
  return out
}

export default function TasksContainer(props: {
  userId: string
  labId: string
  initialTasks?: LaboratoryTasksPagePayload
  initialNotifications: AppNotification[]
  laboratoryMembers: InitialMembersTypes[]
}) {
  const { userId, labId, initialTasks, initialNotifications, laboratoryMembers } = props

  const [mainTab, setMainTab] = useState<"list" | "calendar">("list")
  const [assigneeFilter, setAssigneeFilter] = useState<AssigneeScopeFilter>("all")
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilterValue>("all")
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilterValue>("all")

  const [tasks, setTasks] = useState<Task[]>(() => initialTasks?.items ?? [])
  const [pagination, setPagination] = useState<LaboratoryTasksPagination>(
    () => initialTasks?.pagination ?? DEFAULT_PAGINATION,
  )
  const [tasksLoading, setTasksLoading] = useState(false)

  const [calendarMonth, setCalendarMonth] = useState(() => new Date())
  const [calendarTasks, setCalendarTasks] = useState<Task[]>([])
  const [calendarLoading, setCalendarLoading] = useState(false)

  const paginationRef = useRef(pagination)
  const tasksRef = useRef(tasks)
  useEffect(() => {
    paginationRef.current = pagination
  }, [pagination])
  useEffect(() => {
    tasksRef.current = tasks
  }, [tasks])

  const assignees = useMemo(() => membersToAssignees(laboratoryMembers), [laboratoryMembers])

  const loadList = useCallback(
    async (
      page: number,
      pageSize: number,
    ): Promise<{ items: Task[]; pagination: LaboratoryTasksPagination } | null> => {
      setTasksLoading(true)
      try {
        const qs = buildLabTasksQuery({
          page,
          pageSize,
          status: statusFilter,
          priority: priorityFilter,
          assigneeScope: assigneeFilter,
        })
        const res = (await apiClient.get(`/api/tasks/laboratory/${userId}/${labId}?${qs}`)) as
          | { success?: boolean; data?: { items: Task[]; pagination: LaboratoryTasksPagination } }
          | undefined
        if (res?.success && res.data) {
          setTasks(res.data.items)
          setPagination(res.data.pagination)
          return res.data
        }
        toast.error("Failed to load tasks")
        return null
      } catch {
        toast.error("Failed to load tasks")
        return null
      } finally {
        setTasksLoading(false)
      }
    },
    [userId, labId, statusFilter, priorityFilter, assigneeFilter],
  )

  const loadCalendar = useCallback(async () => {
    setCalendarLoading(true)
    try {
      const start = startOfMonth(calendarMonth)
      const end = endOfMonth(calendarMonth)
      const qs = buildLabTasksQuery({
        page: 1,
        pageSize: 250,
        status: statusFilter,
        priority: priorityFilter,
        assigneeScope: assigneeFilter,
        dueDateFrom: start.toISOString(),
        dueDateTo: end.toISOString(),
      })
      const res = (await apiClient.get(`/api/tasks/laboratory/${userId}/${labId}?${qs}`)) as
        | { success?: boolean; data?: { items: Task[] } }
        | undefined
      if (res?.success && res.data?.items) {
        setCalendarTasks(res.data.items)
      } else {
        toast.error("Failed to load calendar tasks")
      }
    } catch {
      toast.error("Failed to load calendar tasks")
    } finally {
      setCalendarLoading(false)
    }
  }, [userId, labId, calendarMonth, statusFilter, priorityFilter, assigneeFilter])

  useEffect(() => {
    void loadList(1, paginationRef.current.pageSize)
  }, [loadList])

  useEffect(() => {
    if (mainTab !== "calendar") return
    void loadCalendar()
  }, [mainTab, loadCalendar])

  const handlePagination = useCallback(
    async (next: { page?: number; pageSize?: number }) => {
      const page = next.page ?? paginationRef.current.currentPage
      const pageSize = next.pageSize ?? paginationRef.current.pageSize
      await loadList(page, pageSize)
    },
    [loadList],
  )

  const handleCreate = useCallback(
    async (payload: ExperimentTaskUpsertPayload) => {
      try {
        await apiClient.post(`/api/tasks/laboratory/${userId}/${labId}`, {
          title: payload.title,
          description: payload.description,
          assignedToId: payload.assignedToId,
          dueDate: payload.dueDate,
          priority: payload.priority,
          status: payload.status ?? TaskStatus.PENDING,
        })
        toast.success("Task created")
        await loadList(1, paginationRef.current.pageSize)
        if (mainTab === "calendar") void loadCalendar()
      } catch {
        toast.error("Failed to create task")
      }
    },
    [userId, labId, loadList, loadCalendar, mainTab],
  )

  const handleUpdate = useCallback(
    async (taskId: string, payload: ExperimentTaskUpsertPayload) => {
      try {
        await apiClient.put(`/api/tasks/laboratory/${userId}/${labId}/${taskId}`, {
          title: payload.title,
          description: payload.description,
          assignedToId: payload.assignedToId,
          dueDate: payload.dueDate,
          priority: payload.priority,
          status: payload.status,
        })
        toast.success("Task updated")
        await loadList(paginationRef.current.currentPage, paginationRef.current.pageSize)
        if (mainTab === "calendar") void loadCalendar()
      } catch {
        toast.error("Failed to update task")
      }
    },
    [userId, labId, loadList, loadCalendar, mainTab],
  )

  const handlePatchStatus = useCallback(
    async (taskId: string, nextStatus: TaskStatus) => {
      const snapshot = tasksRef.current
      setTasks((rows) => rows.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)))
      try {
        const res = (await apiClient.patch(`/api/tasks/laboratory/${userId}/${labId}/${taskId}/status`, {
          status: nextStatus,
        })) as { success?: boolean; data?: Task } | undefined
        if (res?.success && res.data) {
          setTasks((rows) => rows.map((t) => (t.id === taskId ? res.data! : t)))
          toast.success("Task status updated")
          if (mainTab === "calendar") void loadCalendar()
        } else {
          setTasks(snapshot)
          toast.error("Failed to update status")
        }
      } catch {
        setTasks(snapshot)
        toast.error("Failed to update status")
      }
    },
    [userId, labId, loadCalendar, mainTab],
  )

  const handleDelete = useCallback(
    async (taskId: string) => {
      try {
        await apiClient.delete(`/api/tasks/laboratory/${userId}/${labId}/${taskId}`)
        toast.success("Task deleted")
        const pg = paginationRef.current
        const out = await loadList(pg.currentPage, pg.pageSize)
        if (
          out &&
          out.items.length === 0 &&
          out.pagination.totalCount > 0 &&
          out.pagination.currentPage > out.pagination.totalPages
        ) {
          await loadList(Math.max(1, out.pagination.totalPages), out.pagination.pageSize)
        }
        if (mainTab === "calendar") void loadCalendar()
      } catch {
        toast.error("Failed to delete task")
      }
    },
    [userId, labId, loadList, loadCalendar, mainTab],
  )

  const onPrevMonth = useCallback(() => {
    setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  }, [])
  const onNextMonth = useCallback(() => {
    setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
  }, [])

  return (
    <TasksView
      initialNotifications={initialNotifications}
      onPaginationChange={handlePagination}
      onPatchTaskStatus={handlePatchStatus}
      onAssigneeFilter={setAssigneeFilter}
      onPriorityFilter={setPriorityFilter}
      onCalendarPrevMonth={onPrevMonth}
      onCalendarNextMonth={onNextMonth}
      calendarLoading={calendarLoading}
      onStatusFilter={setStatusFilter}
      priorityFilter={priorityFilter}
      assigneeFilter={assigneeFilter}
      calendarMonth={calendarMonth}
      calendarTasks={calendarTasks}
      onMainTabChange={setMainTab}
      statusFilter={statusFilter}
      onCreateTask={handleCreate}
      onUpdateTask={handleUpdate}
      onDeleteTask={handleDelete}
      tasksLoading={tasksLoading}
      pagination={pagination}
      assignees={assignees}
      mainTab={mainTab}
      userId={userId}
      labId={labId}
      tasks={tasks}
    />
  )
}
