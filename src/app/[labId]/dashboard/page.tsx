"use server"

import type { AppNotification } from "@/src/components/tasks/notifications";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";
import { loadLaboratoryPlan } from "@/src/lib/paid-features";
import { serverApiClient } from "@/src/lib/serverApiClient";
import DashboardContainer from "./deshboard.container";
import type { PageProps } from "./types";

export default async function Page ({params}: PageProps) {
  const {labId} = await params;
  const userId = await getServerAuthenticatedUserId()

  const notificationsQuery = new URLSearchParams({ limit: "10", labId }).toString()
  const laboratorySubscription = await loadLaboratoryPlan(userId, labId)
  const paidFeatures = laboratorySubscription.paidFeatures

  const [animalSummary, experiments, tasks, notificationsRes] = await Promise.all([
    serverApiClient.get(`/api/animals/${userId}/${labId}/summary`),
    paidFeatures ? serverApiClient.get(`/api/experiments/${userId}/${labId}`) : Promise.resolve({ data: [] }),
    paidFeatures ? serverApiClient.get(`/api/tasks/${userId}/${labId}`) : Promise.resolve({ data: [] }),
    paidFeatures
      ? serverApiClient.get(`/api/users/${userId}/notifications?${notificationsQuery}`)
      : Promise.resolve(null),
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
      laboratorySubscription={laboratorySubscription}
      notifications={notifications}
      experiments={experiments.data}
      animalSummary={animalSummary.data}
      tasks={tasks.data}
    />
  )
}
