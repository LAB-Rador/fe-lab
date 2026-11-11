import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId"
import { PlanRequired } from "@/src/components/plan-required"
import { loadLaboratoryPlan } from "@/src/lib/paid-features"
import { serverApiClient } from "@/src/lib/serverApiClient"
import { notFound } from "next/navigation"
import CageDetailView from "./cage-detail.view"
import type { Cage } from "../types"

export default async function CageDetailPage({ params }: { params: Promise<{ labId: string; cageId: string }> }) {
    const { labId, cageId } = await params
    const userId = await getServerAuthenticatedUserId()
    const plan = await loadLaboratoryPlan(userId, labId)
    if (!plan.paidFeatures) return <PlanRequired feature="Cages" />
    let cage: Cage
    try {
        const response = await serverApiClient.get(`/api/cages/${userId}/${encodeURIComponent(labId)}/${cageId}`)
        cage = response.data as Cage
    } catch {
        notFound()
    }

    return <CageDetailView labId={labId} cage={cage} />
}
