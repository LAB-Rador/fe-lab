"use server"

import AnimalContainer from "./animal.container";
import { apiClient } from "@/src/lib/apiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function AnimalsPage({params}: PageProps) {
  const {labId} = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const rows = 10;
  const page = 1;

  const animals = await apiClient.get(`/api/animals/${userId}/${labId}/${rows}/${page}/${JSON.stringify({})}`);
  const animalTypes = await apiClient.get(`/api/animals/types/${userId}/${labId}`);
  const animalEnums = await apiClient.get(`/api/animals/enums`);

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
