"use client"

import { CreatePairDialog } from "@/src/components/breeding/create-pair-dialog"
import { useMemo, useState } from "react"
import type { BreedingPair } from "./types"
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

    return (
        <>
            <BreedingView
                labId={labId}
                counts={counts}
                pairs={filtered}
                selected={selected}
                search={search}
                status={status}
                setSearch={setSearch}
                setStatus={setStatus}
                onSelect={setSelectedId}
                onCreate={() => setCreateOpen(true)}
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
