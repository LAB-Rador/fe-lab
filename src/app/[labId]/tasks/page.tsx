import type { AppNotification } from "@/src/components/tasks/notifications"
import type { LaboratoryTasksPagePayload } from "./types"
import type { InitialMembersTypes } from "../team/types"
import { createServerApiClient } from "@/src/lib/serverApiClient"
import TasksContainer from "./tasks.container"
import { cookies } from "next/headers"

type PageProps = {
  params: Promise<{ labId: string }>
}

export default async function TasksPage({ params }: PageProps) {
  const { labId } = await params
  const cookieStore = await cookies()
  const api = createServerApiClient(cookieStore)
  const userId = cookieStore.get("USER_ID")?.value ?? "default"
  const initialTasksPageSize = 10

  const [membersRes, tasksRes, notificationsRes] = await Promise.all([
    api.get(`/api/laboratory/${userId}/${labId}`),
    api.get(
      `/api/tasks/laboratory/${userId}/${labId}?page=1&pageSize=${initialTasksPageSize}`,
    ),
    api.get(`/api/users/${userId}/notifications?limit=40`),
  ])

  const laboratoryMembers = (membersRes && "data" in membersRes && Array.isArray(membersRes.data)
    ? membersRes.data
    : []) as InitialMembersTypes[]

  let initialTasks: LaboratoryTasksPagePayload | undefined
  if (
    tasksRes &&
    typeof tasksRes === "object" &&
    "success" in tasksRes &&
    tasksRes.success &&
    tasksRes.data &&
    typeof tasksRes.data === "object"
  ) {
    const d = tasksRes.data as { items?: unknown; pagination?: unknown }
    initialTasks = {
      items: d.items as LaboratoryTasksPagePayload["items"],
      pagination: d.pagination as LaboratoryTasksPagePayload["pagination"],
    }
  }

  const initialNotifications =
    notificationsRes &&
    typeof notificationsRes === "object" &&
    "success" in notificationsRes &&
    notificationsRes.success &&
    Array.isArray(notificationsRes.data)
      ? (notificationsRes.data as AppNotification[])
      : []

  return (
    <TasksContainer
    initialNotifications={initialNotifications}
    laboratoryMembers={laboratoryMembers}
    initialTasks={initialTasks}
    userId={userId}
    labId={labId}
    />
  )
}
