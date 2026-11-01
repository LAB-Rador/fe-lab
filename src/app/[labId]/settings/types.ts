export interface LabAnimalType {
    id: string
    name: string
    description: string
    animalCount: number
}

export interface LabSubscription {
    memberCount: number
    planName: string | null
    maxUsers: number | null
    startDate: string | null
    endDate: string | null
}

export interface LabBreedingProtocol {
    id: string
    name: string
    description: string
    instructions: string
    animalTypeId: string
    animalTypeName: string
    pairCount: number
}

export function readLabSubscription(response: unknown): LabSubscription | null {
    if (!response || typeof response !== "object" || !("data" in response)) return null
    const data = (response as { data?: unknown }).data
    if (!data || typeof data !== "object") return null
    const value = data as { memberCount?: unknown; subscription?: unknown }
    const memberCount = typeof value.memberCount === "number" ? value.memberCount : 0
    const subscription = value.subscription
    if (!subscription || typeof subscription !== "object") {
        return { memberCount, planName: null, maxUsers: null, startDate: null, endDate: null }
    }
    const row = subscription as Record<string, unknown>
    const plan = row.plan as { name?: unknown } | null | undefined
    const planName = plan && typeof plan.name === "string" ? plan.name : null
    const maxUsers = typeof row.maxUsers === "number" ? row.maxUsers : null
    if (!planName || maxUsers === null) {
        return { memberCount, planName: null, maxUsers: null, startDate: null, endDate: null }
    }
    return {
        memberCount,
        planName,
        maxUsers,
        startDate: typeof row.startDate === "string" ? row.startDate : null,
        endDate: typeof row.endDate === "string" ? row.endDate : null,
    }
}

export function readAnimalType(row: unknown): LabAnimalType | null {
    if (!row || typeof row !== "object") return null
    const value = row as Record<string, unknown>
    if (typeof value.id !== "string" || typeof value.name !== "string") return null
    const nested = value._count as { animals?: number } | undefined
    return {
        id: value.id,
        name: value.name,
        description: typeof value.description === "string" ? value.description : "",
        animalCount: typeof value.animalCount === "number" ? value.animalCount : nested?.animals ?? 0,
    }
}

export function readBreedingProtocol(row: unknown): LabBreedingProtocol | null {
    if (!row || typeof row !== "object") return null
    const value = row as Record<string, unknown>
    if (
        typeof value.id !== "string" ||
        typeof value.name !== "string" ||
        typeof value.animalTypeId !== "string" ||
        typeof value.animalTypeName !== "string" ||
        typeof value.pairCount !== "number"
    ) return null
    return {
        id: value.id,
        name: value.name,
        description: typeof value.description === "string" ? value.description : "",
        instructions: typeof value.instructions === "string" ? value.instructions : "",
        animalTypeId: value.animalTypeId,
        animalTypeName: value.animalTypeName,
        pairCount: value.pairCount,
    }
}
