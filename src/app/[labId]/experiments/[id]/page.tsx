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
  const experiment = await apiClient.get(`/api/experiments/unique/${userId}/${labId}/${experimentId}`);

  return (
    <ExperimentContainer
      experiment={experiment.data}
      experimentId={experimentId}
      labId={labId}
    />
  )
}
