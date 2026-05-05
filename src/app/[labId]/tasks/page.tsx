import type { AppNotification } from "@/src/components/tasks/notifications"
import type { LaboratoryTasksPagePayload } from "./types"
import type { InitialMembersTypes } from "../team/types"
import { serverApiClient } from "@/src/lib/serverApiClient"
import TasksContainer from "./tasks.container"
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"

type PageProps = {
  params: Promise<{ labId: string }>
}

export default async function TasksPage({ params }: PageProps) {
  const { labId } = await params
  const userId = await getServerAuthenticatedUserId()
  const initialTasksPageSize = 10

  const notificationsQuery = new URLSearchParams({
    limit: String(initialTasksPageSize),
    labId,
  }).toString()

  const [membersRes, tasksRes, notificationsRes] = await Promise.all([
    serverApiClient.get(`/api/laboratory/${userId}/${labId}`),
    serverApiClient.get(
      `/api/tasks/laboratory/${userId}/${labId}?page=1&pageSize=${initialTasksPageSize}`,
    ),
    serverApiClient.get(`/api/users/${userId}/notifications?${notificationsQuery}`),
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
