"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { BREEDING_STATUSES, type BreedingPair } from "@/src/app/[labId]/breeding/types"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Button } from "@/src/components/ui/button"
import { Textarea } from "@/src/components/ui/textarea"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { apiClient } from "@/src/lib/apiClient"
import { useEffect, useState, type FormEvent } from "react"

interface BreedingAnimalOption {
    id: string
    identifier: string
    name: string | null
    sex: string | null
    animalTypeId: string
}

interface ProtocolOption {
    id: string
    name: string
    animalTypeId: string
    instructions: string
}

function animalOptionLabel(animal: BreedingAnimalOption) {
    const name = animal.name?.trim()
    const title = name ? `${name} (${animal.identifier})` : animal.identifier
    return animal.sex ? `${title} · ${animal.sex}` : title
}

export function CreatePairDialog({
    open,
    userId,
    labId,
    onOpenChange,
    onCreated,
}: {
    open: boolean
    userId: string
    labId: string
    onOpenChange: (open: boolean) => void
    onCreated: (pair: BreedingPair) => void
}) {
    const [animals, setAnimals] = useState<BreedingAnimalOption[]>([])
    const [protocols, setProtocols] = useState<ProtocolOption[]>([])
    const [motherId, setMotherId] = useState("")
    const [fatherId, setFatherId] = useState("")
    const [protocolId, setProtocolId] = useState("")
    const [offspringIds, setOffspringIds] = useState<string[]>([])
    const [status, setStatus] = useState<string>("SUCCESSFUL")
    const [startDate, setStartDate] = useState("")
    const [notes, setNotes] = useState("")
    const [error, setError] = useState("")
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!open) return
        let cancelled = false
        setError("")
        apiClient.get(`/api/animals/${userId}/${labId}/200/1/null`).then((response) => {
            if (cancelled) return
            const rows = Array.isArray(response?.data) ? response.data : []
            setAnimals(rows.map((animal: BreedingAnimalOption & { animalType?: { id?: string } }) => ({
                id: animal.id,
                identifier: animal.identifier,
                name: animal.name,
                sex: animal.sex,
                animalTypeId: animal.animalType?.id ?? animal.animalTypeId ?? "",
            })))
        }).catch(() => {
            if (!cancelled) setError("Could not load animals for this laboratory.")
        })
        apiClient.get(`/api/breedings/${userId}/${labId}/protocols`).then((response) => {
            if (cancelled) return
            const rows = Array.isArray(response?.data) ? response.data : []
            setProtocols(rows.map((protocol: ProtocolOption) => ({
                id: protocol.id,
                name: protocol.name,
                animalTypeId: protocol.animalTypeId,
                instructions: protocol.instructions,
            })))
        }).catch(() => {
            if (!cancelled) setProtocols([])
        })
        return () => {
            cancelled = true
        }
    }, [open, userId, labId])

    function toggleOffspring(id: string, checked: boolean) {
        setOffspringIds((current) => checked ? [...current, id] : current.filter((item) => item !== id))
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault()
        if (!motherId || !fatherId || !startDate) {
            setError("Mother, father, and start date are required.")
            return
        }
        if (motherId === fatherId) {
            setError("Mother and father must be different animals.")
            return
        }
        setSaving(true)
        setError("")
        try {
            const response = await apiClient.post(`/api/breedings/${userId}/${labId}`, {
                motherId,
                fatherId,
                protocolId: protocolId || null,
                offspringIds: offspringIds.filter((id) => id !== motherId && id !== fatherId),
                status,
                startDate,
                notes,
            })
            if (!response?.success || !response.data) {
                setError("This pair could not be saved.")
                return
            }
            onCreated(response.data as BreedingPair)
            setMotherId("")
            setFatherId("")
            setProtocolId("")
            setOffspringIds([])
            setNotes("")
            setStartDate("")
            onOpenChange(false)
        } catch {
            setError("This pair could not be saved.")
        } finally {
            setSaving(false)
        }
    }

    const offspringChoices = animals.filter((animal) => animal.id !== motherId && animal.id !== fatherId)
    const mother = animals.find((animal) => animal.id === motherId)
    const protocolChoices = protocols.filter((protocol) => protocol.animalTypeId === mother?.animalTypeId)
    const selectedProtocol = protocolChoices.find((protocol) => protocol.id === protocolId)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New breeding pair</DialogTitle>
                    <DialogDescription>Link a mother, a father, and any offspring already in this laboratory.</DialogDescription>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="breeding-mother">Mother</Label>
                        <Select value={motherId} onValueChange={(value) => { setMotherId(value); setProtocolId("") }}>
                            <SelectTrigger id="breeding-mother">
                                <SelectValue placeholder="Select mother" />
                            </SelectTrigger>
                            <SelectContent>
                                {animals.map((animal) => (
                                    <SelectItem key={animal.id} value={animal.id}>{animalOptionLabel(animal)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="breeding-father">Father</Label>
                        <Select value={fatherId} onValueChange={setFatherId}>
                            <SelectTrigger id="breeding-father">
                                <SelectValue placeholder="Select father" />
                            </SelectTrigger>
                            <SelectContent>
                                {animals.map((animal) => (
                                    <SelectItem key={animal.id} value={animal.id}>{animalOptionLabel(animal)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {motherId ? (
                        <div className="space-y-2">
                            <Label htmlFor="breeding-protocol">Protocol</Label>
                            <Select value={protocolId || "NONE"} onValueChange={(value) => setProtocolId(value === "NONE" ? "" : value)}>
                                <SelectTrigger id="breeding-protocol">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NONE">No protocol</SelectItem>
                                    {protocolChoices.map((protocol) => (
                                        <SelectItem key={protocol.id} value={protocol.id}>{protocol.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {protocolChoices.length === 0 ? (
                                <p className="text-sm text-gray-500">No protocols for this animal type.</p>
                            ) : null}
                            {selectedProtocol?.instructions ? (
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedProtocol.instructions}</p>
                            ) : null}
                        </div>
                    ) : null}
                    <div className="space-y-2">
                        <Label>Offspring</Label>
                        <div className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
                            {offspringChoices.length === 0 ? (
                                <p className="text-sm text-gray-500">No other animals to link.</p>
                            ) : offspringChoices.map((animal) => (
                                <label key={animal.id} className="flex items-center gap-2 text-sm">
                                    <Checkbox
                                        checked={offspringIds.includes(animal.id)}
                                        onCheckedChange={(checked) => toggleOffspring(animal.id, checked === true)}
                                    />
                                    {animalOptionLabel(animal)}
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="breeding-start">Started</Label>
                            <Input id="breeding-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="breeding-status">Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger id="breeding-status">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {BREEDING_STATUSES.map((item) => (
                                        <SelectItem key={item} value={item}>{item}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="breeding-notes">Notes</Label>
                        <Textarea id="breeding-notes" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Optional notes" />
                    </div>
                    {error ? <p className="text-sm text-red-600">{error}</p> : null}
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                            {saving ? "Saving..." : "Save pair"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
