"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { animalCountLabel, animalLabel, type CageSummary } from "@/src/app/[labId]/cages/types"
import type { Animal } from "@/src/components/animals/types"
import { Button } from "@/src/components/ui/button"
import { apiClient } from "@/src/lib/apiClient"
import { useEffect, useState } from "react"
import { toast } from "sonner"

const NO_CAGE = "none"

function errorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && "detail" in error) {
        const detail = (error as Error & { detail?: string }).detail
        if (detail) return detail
    }
    return fallback
}

function cageOptionLabel(cage: CageSummary) {
    return `${cage.name} · ${animalCountLabel(cage.animalCount)}`
}

export function MoveToCageDialog({
    animal,
    userId,
    labId,
    onOpenChange,
    onMoved,
}: {
    animal: Animal | null
    userId: string
    labId: string
    onOpenChange: (open: boolean) => void
    onMoved: (animalId: string, cage: { id: string; name: string } | null) => void
}) {
    const [cages, setCages] = useState<CageSummary[]>([])
    const [choice, setChoice] = useState("")
    const [loading, setLoading] = useState(false)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (!animal?.id) return
        let cancelled = false
        setChoice("")
        setCages([])
        setLoading(true)
        apiClient.get(`/api/cages/${userId}/${labId}`)
            .then((response) => {
                if (cancelled) return
                const rows = response?.data?.cages
                setCages(Array.isArray(rows) ? rows as CageSummary[] : [])
            })
            .catch((error: unknown) => {
                if (!cancelled) toast.error(errorMessage(error, "Failed to load cages"))
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [animal?.id, userId, labId])

    const options = cages.filter((cage) => cage.id !== animal?.cage?.id)
    const canClear = Boolean(animal?.cage)
    const hasChoice = options.length > 0 || canClear

    const onMove = async () => {
        if (!animal?.id || !choice || busy) return
        setBusy(true)
        try {
            if (choice === NO_CAGE) {
                await apiClient.delete(`/api/cages/${userId}/${labId}/${animal.cage!.id}/animals/${animal.id}`)
                onMoved(animal.id, null)
                return
            }
            const cage = options.find((item) => item.id === choice)!
            await apiClient.post(`/api/cages/${userId}/${labId}/${cage.id}/animals`, { animalId: animal.id })
            onMoved(animal.id, { id: cage.id, name: cage.name })
        } catch (error) {
            toast.error(errorMessage(error, "Failed to move animal"))
        } finally {
            setBusy(false)
        }
    }

    return (
        <Dialog open={animal !== null} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Move to cage</DialogTitle>
                    {animal ? (
                        <DialogDescription>
                            {animal.cage
                                ? `${animalLabel(animal)} is in ${animal.cage.name}.`
                                : `${animalLabel(animal)} has no cage.`}
                        </DialogDescription>
                    ) : null}
                </DialogHeader>
                {loading ? (
                    <p className="text-sm text-gray-500">Loading cages...</p>
                ) : hasChoice ? (
                    <Select value={choice || undefined} onValueChange={setChoice}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a cage" />
                        </SelectTrigger>
                        <SelectContent>
                            {canClear ? <SelectItem value={NO_CAGE}>No cage</SelectItem> : null}
                            {options.map((cage) => (
                                <SelectItem key={cage.id} value={cage.id}>
                                    {cageOptionLabel(cage)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                ) : (
                    <p className="text-sm text-gray-500">No cages yet.</p>
                )}
                <DialogFooter>
                    <Button type="button" disabled={busy || loading || !choice} onClick={() => { void onMove() }}>
                        Move
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
