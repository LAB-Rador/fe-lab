import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { serverApiClient } from "@/src/lib/serverApiClient"
import ReportsContainer from "./reports.container"
import type { ReportsCatalog } from "./types"

export default async function ReportsPage({
    params,
}: {
    params: Promise<{ labId: string }>
}) {
    const { labId } = await params
    const userId = await getServerAuthenticatedUserId()

    let catalog: ReportsCatalog | null = null
    let error: string | null = null
    try {
        const response = await serverApiClient.get(`/api/reports/${userId}/${labId}`)
        if (
            response &&
            typeof response === "object" &&
            "success" in response &&
            response.success &&
            response.data &&
            typeof response.data === "object" &&
            "fields" in response.data &&
            "reports" in response.data
        ) {
            catalog = response.data as ReportsCatalog
        } else {
            error = "Could not load reports."
        }
    } catch (cause) {
        error = cause instanceof Error ? cause.message : "Could not load reports."
    }

    return <ReportsContainer userId={userId} labId={labId} catalog={catalog} error={error} />
}
