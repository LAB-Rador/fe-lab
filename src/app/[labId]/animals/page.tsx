"use server"

import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";
import { getAnimalEnums } from "@/src/lib/cached/getAnimalEnums";
import { serverApiClient } from "@/src/lib/serverApiClient";
import AnimalContainer from "./animal.container";
import type { AnimalEnums } from "./types";
import type { PageProps } from "./types";

const rows = 10;
const page = 1;

export default async function AnimalsPage({params}: PageProps) {
  const {labId} = await params;
  const userId = await getServerAuthenticatedUserId()

  const filters = JSON.stringify({})

  const [animals, animalTypes, animalEnums] = await Promise.all([
    serverApiClient.get(`/api/animals/${userId}/${labId}/${rows}/${page}/${filters}`),
    serverApiClient.get(`/api/animals/types/${userId}/${labId}`),
    getAnimalEnums(),
  ])

  return (
    <AnimalContainer
      animalEnums={animalEnums.data as AnimalEnums}
      animalPagination={animals.pagination}
      animalTypes={animalTypes.data}
      animals={animals.data}
      userId={userId}
      labId={labId} 
    />
  )
}
