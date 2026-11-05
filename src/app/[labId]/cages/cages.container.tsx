"use client"

import { useState } from "react"
import { apiClient } from "@/src/lib/apiClient"
import { toast } from "sonner"
import CagesView from "./cages.view"
import { type Cage, type CageListAnimal } from "./types"

function errorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && "detail" in error) {
        const detail = (error as Error & { detail?: string }).detail
        if (detail) return detail
    }
    return fallback
}

export default function CagesContainer({
    cages: initialCages,
    animals: initialAnimals,
    labId,
    userId,
}: {
    cages: Cage[]
    animals: CageListAnimal[]
    labId: string
    userId: string
}) {
    const [cages, setCages] = useState(initialCages)
    const [animals, setAnimals] = useState(initialAnimals)
    const [name, setName] = useState("")
    const [notes, setNotes] = useState("")
    const [selectedByCage, setSelectedByCage] = useState<Record<string, string>>({})
    const [busy, setBusy] = useState(false)

    const replaceCage = (updated: Cage, animalId: string, nextCageId: string | null) => {
        setCages((current) => current.map((cage) => {
            if (cage.id === updated.id) return updated
            return {
                ...cage,
                animals: cage.animals.filter((animal) => animal.id !== animalId),
            }
        }))
        setAnimals((current) => current.map((animal) => (
            animal.id === animalId ? { ...animal, cageId: nextCageId } : animal
        )))
    }

    const onCreate = async () => {
        if (busy) return
        setBusy(true)
        try {
            const response = await apiClient.post(`/api/cages/${userId}/${labId}`, { name, notes })
            const created = response.data as Cage
            setCages((current) => [...current, created].sort((a, b) => a.name.localeCompare(b.name)))
            setName("")
            setNotes("")
        } catch (error) {
            toast.error(errorMessage(error, "Failed to create cage"))
        } finally {
            setBusy(false)
        }
    }

    const onAddAnimal = async (cageId: string) => {
        const animalId = selectedByCage[cageId]
        if (!animalId || busy) return
        setBusy(true)
        try {
            const response = await apiClient.post(`/api/cages/${userId}/${labId}/${cageId}/animals`, { animalId })
            replaceCage(response.data as Cage, animalId, cageId)
            setSelectedByCage((current) => ({ ...current, [cageId]: "" }))
        } catch (error) {
            toast.error(errorMessage(error, "Failed to add animal to cage"))
        } finally {
            setBusy(false)
        }
    }

    const onRemoveAnimal = async (cageId: string, animalId: string) => {
        if (busy) return
        setBusy(true)
        try {
            const response = await apiClient.delete(`/api/cages/${userId}/${labId}/${cageId}/animals/${animalId}`)
            replaceCage(response.data as Cage, animalId, null)
        } catch (error) {
            toast.error(errorMessage(error, "Failed to remove animal from cage"))
        } finally {
            setBusy(false)
        }
    }

    return (
        <CagesView
            labId={labId}
            cages={cages}
            animals={animals}
            name={name}
            notes={notes}
            busy={busy}
            selectedByCage={selectedByCage}
            setName={setName}
            setNotes={setNotes}
            setSelectedAnimal={(cageId, animalId) => {
                setSelectedByCage((current) => ({ ...current, [cageId]: animalId }))
            }}
            onCreate={() => { void onCreate() }}
            onAddAnimal={(cageId) => { void onAddAnimal(cageId) }}
            onRemoveAnimal={(cageId, animalId) => { void onRemoveAnimal(cageId, animalId) }}
        />
    )
}
