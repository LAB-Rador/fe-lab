import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { serverApiClient } from "@/src/lib/serverApiClient"
import { notFound } from "next/navigation"
import CageDetailView from "./cage-detail.view"
import type { Cage } from "../types"

export default async function CageDetailPage({ params }: { params: Promise<{ labId: string; cageId: string }> }) {
    const { labId, cageId } = await params
    const userId = await getServerAuthenticatedUserId()
    let cage: Cage | undefined
    try {
        const response = await serverApiClient.get(`/api/cages/${userId}/${encodeURIComponent(labId)}`)
        const data = response.data as { cages?: Cage[] } | undefined
        cage = data?.cages?.find((item) => item.id === cageId)
    } catch {
        notFound()
    }
    if (!cage) {
        notFound()
    }

    return <CageDetailView labId={labId} cage={cage} />
}
