import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { serverApiClient } from "@/src/lib/serverApiClient"
import ReportsContainer from "./reports.container"
import { emptyLaboratoryReports, type LaboratoryReports } from "./types"

export default async function ReportsPage({
    params,
}: {
    params: Promise<{ labId: string }>
}) {
    const { labId } = await params
    const userId = await getServerAuthenticatedUserId()

    let reports = emptyLaboratoryReports()
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
            reports = response.data as LaboratoryReports
        }
    } catch {
        reports = emptyLaboratoryReports()
    }

    return <ReportsContainer labId={labId} reports={reports} />
}
