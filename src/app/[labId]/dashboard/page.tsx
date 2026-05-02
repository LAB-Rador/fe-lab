"use server"

import DashboardContainer from "./deshboard.container";
import { createServerApiClient } from "@/src/lib/serverApiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function Page ({params}: PageProps) {
  const {labId} = await params;
  const cookieStore = await cookies();
  const api = createServerApiClient(cookieStore);
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const animals = await api.get(`/api/animals/${userId}/${labId}/999999/1/${JSON.stringify({})}`);
  const experiments = await api.get(`/api/experiments/${userId}/${labId}`);
  const tasks = await api.get(`/api/tasks/${userId}/${labId}`);

  return (
    <DashboardContainer 
      experiments={experiments.data}
      animals={animals.data}
      tasks={tasks.data}
    />
  )
}
