import { animalLabel, type AnimalGenealogy, type PedigreeAnimal } from "@/src/app/[labId]/breeding/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { PedigreeCanvas } from "@/src/components/breeding/pedigree-canvas"
import { Badge } from "@/src/components/ui/badge"
import Link from "next/link"

function formatBirth(value: string | null) {
    if (!value) return "Unknown birth date"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Unknown birth date"
    return `Born ${date.toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "short", day: "numeric" })}`
}

function statusClass(status: string) {
    if (status === "ACTIVE") return "bg-green-100 text-green-800 hover:bg-green-100"
    if (status === "DECEASED") return "bg-red-100 text-red-800 hover:bg-red-100"
    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
}

function RelativeCard({ labId, animal }: { labId: string; animal: PedigreeAnimal }) {
    return (
        <Link href={`/${labId}/animals/${animal.id}`} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-100 text-sm font-semibold text-blue-600">
                {animal.animalType.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{animalLabel(animal)}</p>
                    <Badge variant="outline" className={statusClass(animal.status)}>{animal.status}</Badge>
                </div>
                <p className="truncate text-sm text-gray-500">
                    {animal.identifier} · {animal.sex ?? "Sex unknown"} · {formatBirth(animal.birthDate)}
                </p>
            </div>
        </Link>
    )
}

export function AnimalGenealogy({ labId, genealogy }: { labId: string; genealogy: AnimalGenealogy }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Parents</CardTitle>
                </CardHeader>
                <CardContent>
                    {genealogy.parents.length === 0 ? (
                        <p className="text-sm text-gray-500">No parents recorded.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {genealogy.parents.map((parent) => (
                                <RelativeCard key={parent.id} labId={labId} animal={parent} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Offspring</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Total: {genealogy.offspring.length}</Badge>
                </CardHeader>
                <CardContent>
                    {genealogy.offspring.length === 0 ? (
                        <p className="text-sm text-gray-500">No offspring recorded.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {genealogy.offspring.map((child) => (
                                <RelativeCard key={child.id} labId={labId} animal={child} />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Family tree</CardTitle>
                </CardHeader>
                <CardContent>
                    <PedigreeCanvas
                        labId={labId}
                        current={genealogy.animal}
                        parents={genealogy.parents}
                        offspring={genealogy.offspring}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
