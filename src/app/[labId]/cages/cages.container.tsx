"use client"

import { useState } from "react"
import { apiClient } from "@/src/lib/apiClient"
import { toast } from "sonner"
import CagesView from "./cages.view"
import type { CageSummary } from "./types"

function errorMessage(error: unknown, fallback: string) {
    if (error instanceof Error && "detail" in error) {
        const detail = (error as Error & { detail?: string }).detail
        if (detail) return detail
    }
    return fallback
}

export default function CagesContainer({
    cages: initialCages,
    labId,
    userId,
}: {
    cages: CageSummary[]
    labId: string
    userId: string
}) {
    const [cages, setCages] = useState(initialCages)
    const [name, setName] = useState("")
    const [notes, setNotes] = useState("")
    const [busy, setBusy] = useState(false)

    const onCreate = async () => {
        if (busy) return
        setBusy(true)
        try {
            const response = await apiClient.post(`/api/cages/${userId}/${labId}`, { name, notes })
            const created = response.data as { id: string; name: string; notes: string | null }
            setCages((current) => [...current, { ...created, animalCount: 0 }].sort((a, b) => a.name.localeCompare(b.name)))
            setName("")
            setNotes("")
        } catch (error) {
            toast.error(errorMessage(error, "Failed to create cage"))
        } finally {
            setBusy(false)
        }
    }

    return (
        <CagesView
            labId={labId}
            cages={cages}
            name={name}
            notes={notes}
            busy={busy}
            setName={setName}
            setNotes={setNotes}
            onCreate={() => { void onCreate() }}
        />
    )
}
