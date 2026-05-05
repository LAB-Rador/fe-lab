"use server"

import ExperimentsContainer from "./experiments.container"
import { serverApiClient } from "@/src/lib/serverApiClient"
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
interface ExperimentsTypes {
  params: {
    labId: string
  }
}

export default async function ExperimentsPage({params}: ExperimentsTypes) {
  const { labId } = await params;
  const userId = await getServerAuthenticatedUserId()
  const animalEnums = await serverApiClient.get(`/api/animals/enums`);
  const experiments = await serverApiClient.get(`/api/experiments/${userId}/${labId}`);

  return (
    <ExperimentsContainer
      experiments={experiments.data}
      animalEnums={animalEnums.data}
      userId={userId}
      labId={labId}
    />
  )
}
