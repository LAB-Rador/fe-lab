"use server"

import type { ExperimentAnimalRecordRow, ExperimentMetricsData, ExperimentTasksPagePayload } from "../types";
import { ExperimentContainer } from "./experiment.container";
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
  const initialTasksPageSize = 10
  const [
    experimentRes,
    laboratoryMembersRes,
    labAnimalsRes,
    metricsRes,
    recordsRes,
    experimentTasksRes,
  ] = await Promise.all([
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
    apiClient
      .get(
        `/api/experiments/unique/${userId}/${labId}/${experimentId}/tasks?page=1&pageSize=${initialTasksPageSize}`,
      )
      .catch(() => ({ success: false as const })),
  ])

  const initialMetrics: ExperimentMetricsData | null =
    metricsRes?.success && metricsRes.data ? (metricsRes.data as ExperimentMetricsData) : null

  const initialAnimalRecords: ExperimentAnimalRecordRow[] =
    recordsRes?.success && Array.isArray(recordsRes.data) ? (recordsRes.data as ExperimentAnimalRecordRow[]) : []

  let initialExperimentTasks: ExperimentTasksPagePayload | undefined
  if (experimentTasksRes?.success && experimentTasksRes.data != null && typeof experimentTasksRes.data === "object") {
    const d = experimentTasksRes.data as { items?: unknown; pagination?: unknown }
    if (Array.isArray(d.items) && d.pagination != null && typeof d.pagination === "object") {
      initialExperimentTasks = {
        items: d.items as ExperimentTasksPagePayload["items"],
        pagination: d.pagination as ExperimentTasksPagePayload["pagination"],
      }
    }
  }

  return (
    <ExperimentContainer
      labAnimals={Array.isArray(labAnimalsRes?.data) ? labAnimalsRes.data : []}
      initialExperimentTasks={initialExperimentTasks}
      initialAnimalRecords={initialAnimalRecords}
      labMembers={laboratoryMembersRes.data}
      experiment={experimentRes.data}
      initialMetrics={initialMetrics}
      experimentId={experimentId}
      userId={userId}
      labId={labId}
    />
  )
}
