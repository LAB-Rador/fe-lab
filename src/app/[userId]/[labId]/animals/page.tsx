"use server"

import AnimalContainer from "./animal.container";
import { apiClient } from "@/src/lib/apiClient";

export default async function AnimalsPage({params}: {params: {userId: string, labId: string}}) {
  const {userId, labId} = await params;

  const animalTypes = await apiClient.get(`/api/animals/types/${userId}/${labId}`);
  const animals = await apiClient.get(`/api/animals/${userId}/${labId}`);
  const animalEnums = await apiClient.get(`/api/animals/enums`);

  return (
    <AnimalContainer 
      animalEnums={animalEnums.data}
      animalTypes={animalTypes.data}
      animals={animals.data}
      userId={userId}
      labId={labId} 
    />
  )
}
