"use server"

import { serverApiClient } from "@/src/lib/serverApiClient";
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
  const animalEnums = await serverApiClient.get(`/api/animals/enums`);
  const laboratoryMembers = await serverApiClient.get(`/api/laboratory/${userId}/${labId}`);

  return (
    <TeamContainer
      initialMembers={laboratoryMembers.data}
      animalEnums={animalEnums.data}
      userId={userId}
      labId={labId}
    />
  );
}
