import { serverApiClient } from "@/src/lib/serverApiClient"
import type { LaboratorySubscription } from "@/src/app/[labId]/dashboard/types"

export type LaboratoryPlan = LaboratorySubscription & { paidFeatures: boolean }

const emptyPlan: LaboratoryPlan = { memberCount: 0, subscription: null, paidFeatures: false }

function isPlan(value: unknown): value is LaboratoryPlan {
    if (!value || typeof value !== "object") return false
    return "memberCount" in value && "subscription" in value && "paidFeatures" in value
}

export async function loadLaboratoryPlan(userId: string, labId: string): Promise<LaboratoryPlan> {
    try {
        const response = await serverApiClient.get(`/api/subscriptions/${userId}/${labId}`)
        if (
            response &&
            typeof response === "object" &&
            "success" in response &&
            response.success &&
            "data" in response &&
            isPlan(response.data)
        ) {
            return {
                memberCount: response.data.memberCount,
                subscription: response.data.subscription,
                paidFeatures: response.data.paidFeatures === true,
            }
        }
    } catch {
        return emptyPlan
    }
    return emptyPlan
}
