"use server"

import DashboardContainer from "./deshboard.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";

export default async function Page ({params}: PageProps) {

  const {userId, labId} = await params;

  const animals = await apiClient.get(`/api/animals/${userId}/${labId}/999999/1/${JSON.stringify({})}`);
  const experiments = await apiClient.get(`/api/experiments/${userId}/${labId}`);
  const tasks = await apiClient.get(`/api/tasks/${userId}/${labId}`);

  return (
    <DashboardContainer 
      experiments={experiments.data}
      animals={animals.data}
      tasks={tasks.data}
    />
  )
}
