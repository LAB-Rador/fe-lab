export interface PedigreeAnimal {
    id: string
    identifier: string
    name: string | null
    sex: string | null
    status: string
    birthDate: string | null
    animalType: string
}

export interface BreedingProtocolRef {
    id: string
    name: string
}

export interface Litter {
    id: string
    bornDate: string
    count: number
    notes: string | null
}

export interface BreedingPair {
    id: string
    status: string
    startDate: string
    endDate: string | null
    notes: string | null
    protocol: BreedingProtocolRef | null
    mother: PedigreeAnimal
    father: PedigreeAnimal
    offspring: PedigreeAnimal[]
    litters: Litter[]
}

export interface AnimalGenealogy {
    animal: PedigreeAnimal
    parents: PedigreeAnimal[]
    offspring: PedigreeAnimal[]
}

export const BREEDING_STATUSES = ["PLANNED", "ACTIVE", "SUCCESSFUL", "FAILED", "CANCELED"] as const

export function animalLabel(animal: PedigreeAnimal) {
    const name = animal.name?.trim()
    return name ? name : animal.identifier
}
