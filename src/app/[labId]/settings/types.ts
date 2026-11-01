export interface LabAnimalType {
    id: string
    name: string
    description: string
    animalCount: number
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
