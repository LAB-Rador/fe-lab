"use server"

import { createServerApiClient } from "@/src/lib/serverApiClient";
import TeamContainer from "./team.container";
import { cookies } from "next/headers";
interface TeamPageTypes {
  params: {
    labId: string
  }
}

export default async function TeamPage({params}: TeamPageTypes) {
  const { labId } = await params;
  const cookieStore = await cookies();
  const api = createServerApiClient(cookieStore);
  const userId = await cookieStore.get('USER_ID')?.value || 'default';
  const animalEnums = await api.get(`/api/animals/enums`);
  const laboratoryMembers = await api.get(`/api/laboratory/${userId}/${labId}`);

  return (
    <TeamContainer
      initialMembers={laboratoryMembers.data}
      animalEnums={animalEnums.data}
      userId={userId}
      labId={labId}
    />
  );
}
