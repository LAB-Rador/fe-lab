"use server"

import DashboardContainer from "./deshboard.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";

export default async function Page ({params}: PageProps) {

  const {userId, labId} = await params;

  const experiments = await apiClient.get(`/api/experimentsCount/${userId}/${labId}`);
  const tasks = await apiClient.get(`/api/tasksCount/${userId}/${labId}`);
  const animals = await apiClient.get(`/api/animals/${userId}/${labId}`);

  return (
    <DashboardContainer 
      experiments={experiments.data}
      animals={animals.data}
      tasks={tasks.data}
    />
  )
}
