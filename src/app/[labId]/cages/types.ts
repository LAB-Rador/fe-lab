export interface CageAnimal {
    id: string
    identifier: string
    name: string | null
}

export interface Cage {
    id: string
    name: string
    notes: string | null
    animals: CageAnimal[]
}

export interface CageListAnimal {
    id: string
    identifier: string
    name: string | null
    cageId: string | null
}

export function animalLabel(animal: { identifier: string; name: string | null }) {
    return animal.name ? `${animal.identifier} · ${animal.name}` : animal.identifier
}
