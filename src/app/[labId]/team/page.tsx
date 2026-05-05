"use server"

import { apiClient } from "@/src/lib/apiClient";
import TeamContainer from "./team.container";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";
interface TeamPageTypes {
  params: {
    labId: string
  }
}

export default async function TeamPage({params}: TeamPageTypes) {
  const { labId } = await params;
  const userId = await getServerAuthenticatedUserId()
  const animalEnums = await apiClient.get(`/api/animals/enums`);
  const laboratoryMembers = await apiClient.get(`/api/laboratory/${userId}/${labId}`);

  return (
    <TeamContainer
      initialMembers={laboratoryMembers.data}
      animalEnums={animalEnums.data}
      userId={userId}
      labId={labId}
    />
  );
}
