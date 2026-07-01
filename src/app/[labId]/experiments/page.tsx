"use server"

import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { getAnimalEnums } from "@/src/lib/cached/getAnimalEnums"
import { serverApiClient } from "@/src/lib/serverApiClient"
import ExperimentsContainer from "./experiments.container"
import type { AnimalEnums } from "../animals/types"
interface ExperimentsTypes {
  params: {
    labId: string
  }
}

export default async function ExperimentsPage({params}: ExperimentsTypes) {
  const { labId } = await params;
  const userId = await getServerAuthenticatedUserId()


  const [animalEnums, experiments] = await Promise.all([
    getAnimalEnums(),
    serverApiClient.get(`/api/experiments/${userId}/${labId}`),
  ]);

  return (
    <ExperimentsContainer
      experiments={experiments.data}
      animalEnums={animalEnums.data as AnimalEnums}
      userId={userId}
      labId={labId}
    />
  )
}
