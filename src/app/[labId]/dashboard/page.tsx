"use server"

import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";
import { serverApiClient } from "@/src/lib/serverApiClient";
import DashboardContainer from "./deshboard.container";
import type { PageProps } from "./types";

export default async function Page ({params}: PageProps) {
  const {labId} = await params;
  const userId = await getServerAuthenticatedUserId()

  const filters = JSON.stringify({})

  const [animals, experiments, tasks] = await Promise.all([
    serverApiClient.get(`/api/animals/${userId}/${labId}/999999/1/${filters}`),
    serverApiClient.get(`/api/experiments/${userId}/${labId}`),
    serverApiClient.get(`/api/tasks/${userId}/${labId}`),
  ])

  return (
    <DashboardContainer 
      experiments={experiments.data}
      animals={animals.data}
      tasks={tasks.data}
    />
  )
}
