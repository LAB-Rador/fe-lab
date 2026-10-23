import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { serverApiClient } from "@/src/lib/serverApiClient"
import { aggregateLaboratoryReports } from "./aggregate-reports"
import ReportsContainer from "./reports.container"
import { emptyLaboratoryReports, type LaboratoryReports } from "./types"

function asArray<T>(value: unknown): T[] {
    if (Array.isArray(value)) return value as T[]
    if (
        value &&
        typeof value === "object" &&
        "items" in value &&
        Array.isArray((value as { items: unknown }).items)
    ) {
        return (value as { items: T[] }).items
    }
    return []
}

export default async function ReportsPage({
    params,
}: {
    params: Promise<{ labId: string }>
}) {
    const { labId } = await params
    const userId = await getServerAuthenticatedUserId()

    try {
        const response = await serverApiClient.get(`/api/reports/${userId}/${labId}`)
        if (
            response &&
            typeof response === "object" &&
            "success" in response &&
            response.success &&
            response.data &&
            typeof response.data === "object"
        ) {
            return (
                <ReportsContainer
                    labId={labId}
                    reports={response.data as LaboratoryReports}
                />
            )
        }
    } catch {
        /* fall through to existing laboratory endpoints */
    }

    let reports = emptyLaboratoryReports()
    try {
        const filters = JSON.stringify({})
        const [animalsRes, experimentsRes, tasksRes, breedingsRes, membersRes] =
            await Promise.all([
                serverApiClient.get(`/api/animals/${userId}/${labId}/999999/1/${filters}`),
                serverApiClient.get(`/api/experiments/${userId}/${labId}`),
                serverApiClient.get(
                    `/api/tasks/laboratory/${userId}/${labId}?page=1&pageSize=500`,
                ),
                serverApiClient.get(`/api/breedings/${userId}/${labId}`).catch(() => ({ data: [] })),
                serverApiClient.get(`/api/laboratory/${userId}/${labId}`).catch(() => ({ data: [] })),
            ])

        reports = aggregateLaboratoryReports({
            animals: asArray(animalsRes?.data),
            experiments: asArray(experimentsRes?.data),
            tasks: asArray(tasksRes?.data),
            breedingCount: asArray(breedingsRes?.data).length,
            memberCount: asArray(membersRes?.data).length,
            recordCount: 0,
        })
    } catch {
        reports = emptyLaboratoryReports()
    }

    return <ReportsContainer labId={labId} reports={reports} />
}
