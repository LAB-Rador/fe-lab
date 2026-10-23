"use server"

import type { AppNotification } from "@/src/components/tasks/notifications";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";
import { serverApiClient } from "@/src/lib/serverApiClient";
import DashboardContainer from "./deshboard.container";
import type { PageProps } from "./types";

export default async function Page ({params}: PageProps) {
  const {labId} = await params;
  const userId = await getServerAuthenticatedUserId()

  const filters = JSON.stringify({})
  const notificationsQuery = new URLSearchParams({ limit: "10", labId }).toString()

  const [animals, experiments, tasks, notificationsRes] = await Promise.all([
    serverApiClient.get(`/api/animals/${userId}/${labId}/999999/1/${filters}`),
    serverApiClient.get(`/api/experiments/${userId}/${labId}`),
    serverApiClient.get(`/api/tasks/${userId}/${labId}`),
    serverApiClient.get(`/api/users/${userId}/notifications?${notificationsQuery}`),
  ])

  const notifications: AppNotification[] =
    notificationsRes &&
    typeof notificationsRes === "object" &&
    "success" in notificationsRes &&
    notificationsRes.success &&
    Array.isArray(notificationsRes.data)
      ? notificationsRes.data
      : []

  return (
    <DashboardContainer 
      notifications={notifications}
      experiments={experiments.data}
      animals={animals.data}
      tasks={tasks.data}
    />
  )
}
