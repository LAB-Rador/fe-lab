"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { MedicalRecord } from "@/src/app/[labId]/animals/[id]/types"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Plus, Search } from "lucide-react"
import { useMemo, useState } from "react"
import Link from "next/link"

const typeClass: Record<string, string> = {
    MEDICATION: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    TREATMENT: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    EMERGENCY: "bg-red-100 text-red-800 hover:bg-red-100",
    SAMPLING: "bg-green-100 text-green-800 hover:bg-green-100",
}

function typeLabel(value: string) {
    return value
        .split("_")
        .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
        .join(" ")
}

function formatDate(value: string) {
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "—"
    return date.toLocaleDateString("en-US", { timeZone: "UTC", year: "numeric", month: "short", day: "numeric" })
}

function recordedBy(record: MedicalRecord) {
    const name = [record.createdBy?.firstName, record.createdBy?.lastName].filter(Boolean).join(" ")
    return name || "Unknown"
}

export function AnimalMedicalRecords({
    labId,
    animalId,
    records,
}: {
    labId: string
    animalId: string
    records: MedicalRecord[]
}) {
    const [search, setSearch] = useState("")
    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase()
        if (!query) return records
        return records.filter((record) => {
            const haystack = [typeLabel(record.recordType), record.notes, recordedBy(record)].filter(Boolean).join(" ").toLowerCase()
            return haystack.includes(query)
        })
    }, [records, search])

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        type="search"
                        placeholder="Search records..."
                        className="w-full pl-8"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Link href={`/${labId}/animals/${animalId}/measurements/new`}>
                        <Plus className="h-4 w-4" />
                        Add record
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Medical history</CardTitle>
                </CardHeader>
                <CardContent>
                    {records.length === 0 ? (
                        <p className="text-sm text-gray-500">No medical records for this animal.</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-sm text-gray-500">No medical records match this search.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Notes</TableHead>
                                    <TableHead>Recorded by</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={typeClass[record.recordType] ?? "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
                                                {typeLabel(record.recordType)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{record.notes?.trim() || "—"}</TableCell>
                                        <TableCell>{recordedBy(record)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
