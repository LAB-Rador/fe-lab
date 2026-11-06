import { IdLabel } from "@/src/components/id-label"
import { animalLabel, type Cage } from "../types"
import Link from "next/link"

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
                <ul className="space-y-2">
                    {cage.animals.map((animal) => (
                        <li key={animal.id}>
                            <Link href={`/${labId}/animals/${animal.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                                {animalLabel(animal)}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
