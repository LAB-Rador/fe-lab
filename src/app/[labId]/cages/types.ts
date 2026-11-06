export interface CageAnimal {
    id: string
    identifier: string
    name: string | null
    sex: string | null
    strain: string | null
    animalType: { name: string }
}

export interface Cage {
    id: string
    name: string
    notes: string | null
    animals: CageAnimal[]
}

export interface CageSummary {
    id: string
    name: string
    notes: string | null
    animalCount: number
}

export function animalLabel(animal: { identifier: string; name?: string | null }) {
    return animal.name ? `${animal.identifier} · ${animal.name}` : animal.identifier
}

export function animalCountLabel(count: number) {
    return count === 1 ? "1 animal" : `${count} animals`
}
