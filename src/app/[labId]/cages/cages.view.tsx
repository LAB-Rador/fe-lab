import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { animalLabel, type Cage, type CageListAnimal } from "./types"
import Link from "next/link"

export default function CagesView({
    labId,
    cages,
    animals,
    name,
    notes,
    busy,
    selectedByCage,
    setName,
    setNotes,
    setSelectedAnimal,
    onCreate,
    onAddAnimal,
    onRemoveAnimal,
}: {
    labId: string
    cages: Cage[]
    animals: CageListAnimal[]
    name: string
    notes: string
    busy: boolean
    selectedByCage: Record<string, string>
    setName: (value: string) => void
    setNotes: (value: string) => void
    setSelectedAnimal: (cageId: string, animalId: string) => void
    onCreate: () => void
    onAddAnimal: (cageId: string) => void
    onRemoveAnimal: (cageId: string, animalId: string) => void
}) {
    const cageNameById = new Map(cages.map((cage) => [cage.id, cage.name]))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Cages</h1>
                <p className="text-gray-500">Housing for the animals in this laboratory</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>New cage</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
                    <div className="space-y-2">
                        <Label htmlFor="cage-name">Name</Label>
                        <Input
                            id="cage-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="A-01"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cage-notes">Notes</Label>
                        <Input
                            id="cage-notes"
                            value={notes}
                            onChange={(event) => setNotes(event.target.value)}
                            placeholder="Optional"
                        />
                    </div>
                    <Button type="button" className="bg-blue-600 hover:bg-blue-700" disabled={busy || !name.trim()} onClick={onCreate}>
                        Create cage
                    </Button>
                </CardContent>
            </Card>

            {cages.length === 0 ? (
                <p className="text-sm text-gray-500">No cages yet.</p>
            ) : (
                <div className="grid gap-4">
                    {cages.map((cage) => {
                        const options = animals.filter((animal) => animal.cageId !== cage.id)
                        const selected = selectedByCage[cage.id] || ""
                        return (
                            <Card key={cage.id}>
                                <CardHeader>
                                    <CardTitle>{cage.name}</CardTitle>
                                    {cage.notes ? <p className="text-sm text-gray-500">{cage.notes}</p> : null}
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {cage.animals.length === 0 ? (
                                        <p className="text-sm text-gray-500">No animals in this cage.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {cage.animals.map((animal) => (
                                                <li key={animal.id} className="flex items-center justify-between gap-3">
                                                    <Link href={`/${labId}/animals/${animal.id}`} className="font-medium text-gray-900 hover:text-blue-600">
                                                        {animalLabel(animal)}
                                                    </Link>
                                                    <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => onRemoveAnimal(cage.id, animal.id)}>
                                                        Remove
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {animals.length === 0 ? (
                                        <p className="text-sm text-gray-500">No animals in this laboratory.</p>
                                    ) : options.length === 0 ? (
                                        <p className="text-sm text-gray-500">Every animal in this laboratory is already in this cage.</p>
                                    ) : (
                                        <div className="flex flex-col gap-2 sm:flex-row">
                                            <Select value={selected || undefined} onValueChange={(value) => setSelectedAnimal(cage.id, value)}>
                                                <SelectTrigger className="sm:max-w-sm">
                                                    <SelectValue placeholder="Add an animal" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {options.map((animal) => {
                                                        const currentCage = animal.cageId ? cageNameById.get(animal.cageId) : null
                                                        const label = currentCage
                                                            ? `${animalLabel(animal)} · in ${currentCage}`
                                                            : animalLabel(animal)
                                                        return (
                                                            <SelectItem key={animal.id} value={animal.id}>
                                                                {label}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                            <Button type="button" variant="outline" disabled={busy || !selected} onClick={() => onAddAnimal(cage.id)}>
                                                Add
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
