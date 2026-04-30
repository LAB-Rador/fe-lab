"use server"
import { ExperimentContainer } from "./experiment.container";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from "next/headers";
interface ExperimentDetailPageProps {
  params: {
    id: string
    labId: string
  }
}
export default async function ExperimentDetailPage({ params }: ExperimentDetailPageProps) {
  const { id: experimentId, labId } = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';
  const labAnimalsRows = 500
  const labAnimalsPage = 1
  const [experimentRes, laboratoryMembersRes, labAnimalsRes] = await Promise.all([
    apiClient.get(`/api/experiments/unique/${userId}/${labId}/${experimentId}`),
    apiClient.get(`/api/laboratory/${userId}/${labId}`),
    apiClient.get(
      `/api/animals/${userId}/${labId}/${labAnimalsRows}/${labAnimalsPage}/${JSON.stringify({})}`,
    ),
  ])

  return (
    <ExperimentContainer
      experiment={experimentRes.data}
      experimentId={experimentId}
      labId={labId}
      userId={userId}
      labMembers={laboratoryMembersRes.data}
      labAnimals={Array.isArray(labAnimalsRes?.data) ? labAnimalsRes.data : []}
    />
  )
}
