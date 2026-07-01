"use server"

import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";
import { getAnimalEnums } from "@/src/lib/cached/getAnimalEnums";
import { serverApiClient } from "@/src/lib/serverApiClient";
import TeamContainer from "./team.container";
import type { AnimalEnums } from "./types";
interface TeamPageTypes {
  params: {
    labId: string
  }
}

export default async function TeamPage({params}: TeamPageTypes) {
  const { labId } = await params;
  const userId = await getServerAuthenticatedUserId()

  const [laboratoryMembers, animalEnums] = await Promise.all([
    serverApiClient.get(`/api/laboratory/${userId}/${labId}`),
    getAnimalEnums(),
    
  ]) 

  return (
    <TeamContainer
      animalEnums={animalEnums.data as AnimalEnums}
      initialMembers={laboratoryMembers.data}
      userId={userId}
      labId={labId}
    />
  );
}
