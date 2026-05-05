"use server"

import ExperimentsContainer from "./experiments.container"
import { apiClient } from "@/src/lib/apiClient"
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
interface ExperimentsTypes {
  params: {
    labId: string
  }
}

export default async function ExperimentsPage({params}: ExperimentsTypes) {
  const { labId } = await params;
  const userId = await getServerAuthenticatedUserId()
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
