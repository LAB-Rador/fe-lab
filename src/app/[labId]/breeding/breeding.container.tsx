"use client"

import { CreatePairDialog } from "@/src/components/breeding/create-pair-dialog"
import { useMemo, useState } from "react"
import { apiClient } from "@/src/lib/apiClient"
import { toast } from "sonner"
import type { BreedingPair, Litter } from "./types"
import BreedingView from "./breeding.view"

export default function BreedingContainer({
    breedings,
    labId,
    userId,
}: {
    breedings: BreedingPair[]
    labId: string
    userId: string
}) {
    const [pairs, setPairs] = useState(breedings)
    const [createOpen, setCreateOpen] = useState(false)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("all")
    const [selectedId, setSelectedId] = useState<string | null>(breedings[0]?.id ?? null)
    const [bornDate, setBornDate] = useState("")
    const [pupCount, setPupCount] = useState("")
    const [litterNotes, setLitterNotes] = useState("")
    const [recording, setRecording] = useState(false)

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        return pairs.filter((pair) => {
            if (status !== "all" && pair.status !== status) return false
            if (!query) return true
            const haystack = [
                pair.mother.identifier,
                pair.mother.name,
                pair.father.identifier,
                pair.father.name,
                pair.protocol?.name,
                pair.notes,
            ].filter(Boolean).join(" ").toLowerCase()
            return haystack.includes(query)
        })
    }, [pairs, search, status])

    const selected = filtered.find((pair) => pair.id === selectedId) ?? filtered[0] ?? null
    const counts = useMemo(() => ({
        total: pairs.length,
        active: pairs.filter((pair) => pair.status === "ACTIVE").length,
        planned: pairs.filter((pair) => pair.status === "PLANNED").length,
        offspring: pairs.reduce((sum, pair) => sum + pair.offspring.length, 0),
    }), [pairs])

    const clearLitterForm = () => {
        setBornDate("")
        setPupCount("")
        setLitterNotes("")
    }

    const onRecordLitter = async () => {
        if (!selected || recording) return
        setRecording(true)
        try {
            const response = await apiClient.post(`/api/breedings/${userId}/${labId}/${selected.id}/litters`, {
                bornDate,
                count: Number(pupCount),
                notes: litterNotes,
            })
            const litter = response.data as Litter
            setPairs((current) => current.map((pair) => (
                pair.id === selected.id
                    ? { ...pair, litters: [litter, ...pair.litters].sort((a, b) => b.bornDate.localeCompare(a.bornDate)) }
                    : pair
            )))
            clearLitterForm()
        } catch (error) {
            const detail = error instanceof Error && "detail" in error
                ? (error as Error & { detail?: string }).detail
                : undefined
            toast.error(detail || "Failed to record litter")
        } finally {
            setRecording(false)
        }
    }

    return (
        <>
            <BreedingView
                labId={labId}
                counts={counts}
                pairs={filtered}
                selected={selected}
                search={search}
                status={status}
                bornDate={bornDate}
                pupCount={pupCount}
                litterNotes={litterNotes}
                recording={recording}
                setSearch={setSearch}
                setStatus={setStatus}
                setBornDate={setBornDate}
                setPupCount={setPupCount}
                setLitterNotes={setLitterNotes}
                onSelect={(id) => {
                    setSelectedId(id)
                    clearLitterForm()
                }}
                onCreate={() => setCreateOpen(true)}
                onRecordLitter={() => { void onRecordLitter() }}
            />
            <CreatePairDialog
                open={createOpen}
                userId={userId}
                labId={labId}
                onOpenChange={setCreateOpen}
                onCreated={(pair) => {
                    setPairs((current) => [pair, ...current])
                    setSelectedId(pair.id)
                    setStatus("all")
                    setSearch("")
                }}
            />
        </>
    )
}
