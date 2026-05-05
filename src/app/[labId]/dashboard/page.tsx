"use server"

import DashboardContainer from "./deshboard.container";
import { serverApiClient } from "@/src/lib/serverApiClient";
import type { PageProps } from "./types";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";

export default async function Page ({params}: PageProps) {
  const {labId} = await params;
  const userId = await getServerAuthenticatedUserId()

  const animals = await serverApiClient.get(`/api/animals/${userId}/${labId}/999999/1/${JSON.stringify({})}`);
  const experiments = await serverApiClient.get(`/api/experiments/${userId}/${labId}`);
  const tasks = await serverApiClient.get(`/api/tasks/${userId}/${labId}`);

  return (
    <DashboardContainer 
      experiments={experiments.data}
      animals={animals.data}
      tasks={tasks.data}
    />
  )
}
