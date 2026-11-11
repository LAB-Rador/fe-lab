import { PairCanvas } from "@/src/components/breeding/pedigree-canvas"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { BREEDING_STATUSES, animalLabel, type BreedingPair } from "./types"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Plus, Search } from "lucide-react"
import Link from "next/link"

function formatDate(value: string | null) {
    if (!value) return "—"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "short", day: "numeric" })
}

function statusClass(status: string) {
    if (status === "ACTIVE") return "bg-green-100 text-green-800 hover:bg-green-100"
    if (status === "SUCCESSFUL") return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    if (status === "PLANNED") return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    if (status === "FAILED" || status === "CANCELED") return "bg-red-100 text-red-800 hover:bg-red-100"
    return "bg-gray-100 text-gray-800 hover:bg-gray-100"
}

function AnimalLink({ labId, animal }: { labId: string; animal: BreedingPair["mother"] }) {
    return (
        <Link href={`/${labId}/animals/${animal.id}`} className="font-medium text-gray-900 hover:text-blue-600">
            {animalLabel(animal)}
        </Link>
    )
}

export default function BreedingView({
    labId,
    counts,
    pairs,
    selected,
    search,
    status,
    setSearch,
    setStatus,
    bornDate,
    pupCount,
    litterNotes,
    recording,
    setBornDate,
    setPupCount,
    setLitterNotes,
    onSelect,
    onCreate,
    onRecordLitter,
    showLitters,
}: {
    labId: string
    counts: { total: number; active: number; planned: number; offspring: number }
    pairs: BreedingPair[]
    selected: BreedingPair | null
    search: string
    status: string
    bornDate: string
    pupCount: string
    litterNotes: string
    recording: boolean
    setSearch: (value: string) => void
    setStatus: (value: string) => void
    setBornDate: (value: string) => void
    setPupCount: (value: string) => void
    setLitterNotes: (value: string) => void
    onSelect: (id: string) => void
    onCreate: () => void
    onRecordLitter: () => void
    showLitters: boolean
}) {
    const stats = [
        { label: "Pairs", value: counts.total },
        { label: "Active", value: counts.active },
        { label: "Planned", value: counts.planned },
        { label: "Offspring", value: counts.offspring },
    ]

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Breeding</h1>
                    <p className="text-gray-500">Pairs, protocols, and offspring recorded in this laboratory</p>
                </div>
                <Button type="button" onClick={onCreate} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-1 h-4 w-4" />
                    New pair
                </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">{stat.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search animals, protocol, or notes..."
                        className="pl-9"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="sm:w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All statuses</SelectItem>
                        {BREEDING_STATUSES.map((item) => (
                            <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardContent className="p-0">
                    {pairs.length === 0 ? (
                        <p className="p-6 text-sm text-gray-500">No breeding pairs match this view.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mother</TableHead>
                                    <TableHead>Father</TableHead>
                                    <TableHead>Protocol</TableHead>
                                    <TableHead>Started</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Offspring</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pairs.map((pair) => (
                                    <TableRow
                                        key={pair.id}
                                        data-state={selected?.id === pair.id ? "selected" : undefined}
                                        className="cursor-pointer"
                                        onClick={() => onSelect(pair.id)}
                                    >
                                        <TableCell><AnimalLink labId={labId} animal={pair.mother} /></TableCell>
                                        <TableCell><AnimalLink labId={labId} animal={pair.father} /></TableCell>
                                        <TableCell>{pair.protocol?.name ?? "—"}</TableCell>
                                        <TableCell>{formatDate(pair.startDate)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusClass(pair.status)}>{pair.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">{pair.offspring.length}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {selected
                            ? `${animalLabel(selected.mother)} × ${animalLabel(selected.father)}`
                            : "Pair pedigree"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selected?.notes ? <p className="text-sm text-gray-600">{selected.notes}</p> : null}
                    {selected && showLitters ? (
                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-900">Litters</p>
                            {selected.litters.length === 0 ? (
                                <p className="text-sm text-gray-500">No litters recorded.</p>
                            ) : (
                                <ul className="space-y-2">
                                    {selected.litters.map((litter) => (
                                        <li key={litter.id} className="text-sm text-gray-700">
                                            <span className="font-medium text-gray-900">{formatDate(litter.bornDate)}</span>
                                            {` · ${litter.count} ${litter.count === 1 ? "pup" : "pups"}`}
                                            {litter.notes ? ` · ${litter.notes}` : ""}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="grid gap-3 md:grid-cols-[1fr_8rem_1fr_auto] md:items-end">
                                <div className="space-y-2">
                                    <Label htmlFor="litter-date">Birth date</Label>
                                    <Input id="litter-date" type="date" value={bornDate} onChange={(event) => setBornDate(event.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="litter-count">Pups</Label>
                                    <Input id="litter-count" type="number" min={0} step={1} value={pupCount} onChange={(event) => setPupCount(event.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="litter-notes">Notes</Label>
                                    <Input id="litter-notes" value={litterNotes} onChange={(event) => setLitterNotes(event.target.value)} placeholder="Optional" />
                                </div>
                                <Button
                                    type="button"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    disabled={recording || !bornDate || !/^\d+$/.test(pupCount)}
                                    onClick={onRecordLitter}
                                >
                                    Record litter
                                </Button>
                            </div>
                        </div>
                    ) : null}
                    {selected ? (
                        <PairCanvas
                            labId={labId}
                            mother={selected.mother}
                            father={selected.father}
                            offspring={selected.offspring}
                        />
                    ) : (
                        <p className="text-sm text-gray-500">Select a pair to see the animals in it.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
