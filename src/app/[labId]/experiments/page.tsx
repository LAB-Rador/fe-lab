"use server"

import ExperimentsContainer from "./experiments.container"
import { apiClient } from "@/src/lib/apiClient"
import { cookies } from "next/headers"
interface ExperimentsTypes {
  params: {
    labId: string
  }
}

export default async function ExperimentsPage({params}: ExperimentsTypes) {
  const { labId } = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';
  const animalEnums = await apiClient.get(`/api/animals/enums`);
  const experiments = await apiClient.get(`/api/experiments/${userId}/${labId}`);

  return (
    <ExperimentsContainer
      experiments={experiments.data}
      animalEnums={animalEnums.data}
      userId={userId}
      labId={labId}
    />
  )
}
