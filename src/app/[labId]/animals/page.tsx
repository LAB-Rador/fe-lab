"use server"

import AnimalContainer from "./animal.container";
import { serverApiClient } from "@/src/lib/serverApiClient";
import type { PageProps } from "./types";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";

export default async function AnimalsPage({params}: PageProps) {
  const {labId} = await params;
  const userId = await getServerAuthenticatedUserId()

  const rows = 10;
  const page = 1;

  const animals = await serverApiClient.get(`/api/animals/${userId}/${labId}/${rows}/${page}/${JSON.stringify({})}`);
  const animalTypes = await serverApiClient.get(`/api/animals/types/${userId}/${labId}`);
  const animalEnums = await serverApiClient.get(`/api/animals/enums`);

  return (
    <AnimalContainer
      animalPagination={animals.pagination}
      animalEnums={animalEnums.data}
      animalTypes={animalTypes.data}
      animals={animals.data}
      userId={userId}
      labId={labId} 
    />
  )
}
