import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { animalCountLabel, type CageSummary } from "./types"
import Link from "next/link"

export default function CagesView({
    labId,
    cages,
    name,
    notes,
    busy,
    setName,
    setNotes,
    onCreate,
}: {
    labId: string
    cages: CageSummary[]
    name: string
    notes: string
    busy: boolean
    setName: (value: string) => void
    setNotes: (value: string) => void
    onCreate: () => void
}) {
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
                <ul className="w-fit max-w-sm divide-y overflow-hidden rounded-lg border bg-white">
                    {cages.map((cage) => (
                        <li key={cage.id}>
                            <Link href={`/${labId}/cages/${cage.id}`} className="block px-4 py-3 hover:bg-gray-50">
                                <p className="font-medium text-gray-900">{cage.name}</p>
                                <p className="text-sm text-gray-500">
                                    {[cage.notes, animalCountLabel(cage.animalCount)].filter(Boolean).join(" · ")}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
