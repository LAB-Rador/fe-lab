"use server"
import { ExperimentContainer } from "./experiment.container";
import type { ExperimentAnimalRecordRow, ExperimentMetricsData } from "../types";
import { apiClient } from "@/src/lib/apiClient";
import { cookies } from "next/headers";
interface ExperimentDetailPageProps {
  params: Promise<{
    id: string
    labId: string
  }>
}
export default async function ExperimentDetailPage({ params }: ExperimentDetailPageProps) {
  const { id: experimentId, labId } = await params;
  const cookieStore = await cookies();
  const userId = await cookieStore.get('USER_ID')?.value || 'default';
  const labAnimalsRows = 500
  const labAnimalsPage = 1
  const [experimentRes, laboratoryMembersRes, labAnimalsRes, metricsRes, recordsRes] = await Promise.all([
    apiClient.get(`/api/experiments/unique/${userId}/${labId}/${experimentId}`),
    apiClient.get(`/api/laboratory/${userId}/${labId}`),
    apiClient.get(
      `/api/animals/${userId}/${labId}/${labAnimalsRows}/${labAnimalsPage}/${JSON.stringify({})}`,
    ),
    apiClient.get(`/api/experiments/unique/${userId}/${labId}/${experimentId}/metrics`).catch(() => ({
      success: false as const,
    })),
    apiClient
      .get(`/api/experiments/unique/${userId}/${labId}/${experimentId}/records?limit=200`)
      .catch(() => ({ success: false as const })),
  ])

  const initialMetrics: ExperimentMetricsData | null =
    metricsRes?.success && metricsRes.data ? (metricsRes.data as ExperimentMetricsData) : null

  const initialAnimalRecords: ExperimentAnimalRecordRow[] =
    recordsRes?.success && Array.isArray(recordsRes.data) ? (recordsRes.data as ExperimentAnimalRecordRow[]) : []
  return (
    <ExperimentContainer
      labAnimals={Array.isArray(labAnimalsRes?.data) ? labAnimalsRes.data : []}
      labMembers={laboratoryMembersRes.data}
      experiment={experimentRes.data}
      initialAnimalRecords={initialAnimalRecords}
      initialMetrics={initialMetrics}
      experimentId={experimentId}
      userId={userId}
      labId={labId}
    />
  )
}
