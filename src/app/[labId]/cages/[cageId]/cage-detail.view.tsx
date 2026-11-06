import { IdLabel } from "@/src/components/id-label"
import { animalCountLabel, animalLabel, type Cage, type CageAnimal } from "../types"
import Link from "next/link"

function animalDetails(animal: CageAnimal) {
    return [animal.animalType.name, animal.sex, animal.strain].filter(Boolean).join(" · ")
}

export default function CageDetailView({ labId, cage }: { labId: string; cage: Cage }) {
    const path = `/${encodeURIComponent(labId)}/cages/${cage.id}`

    return (
        <div className="space-y-6">
            <Link href={`/${labId}/cages`} className="text-sm text-gray-500 hover:text-gray-900">
                Cages
            </Link>
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{cage.name}</h1>
                    {cage.notes ? <p className="text-gray-500">{cage.notes}</p> : null}
                </div>
                <IdLabel title={cage.name} path={path} />
            </div>
            {cage.animals.length === 0 ? (
                <p className="text-sm text-gray-500">No animals in this cage.</p>
            ) : (
                <div className="space-y-3">
                    <h2 className="text-sm font-medium text-gray-500">{animalCountLabel(cage.animals.length)}</h2>
                    <ul className="w-fit max-w-sm divide-y overflow-hidden rounded-lg border bg-white">
                        {cage.animals.map((animal) => (
                            <li key={animal.id}>
                                <Link href={`/${labId}/animals/${animal.id}`} className="block px-4 py-3 hover:bg-gray-50">
                                    <p className="font-medium text-gray-900">{animalLabel(animal)}</p>
                                    <p className="text-sm text-gray-500">{animalDetails(animal)}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
