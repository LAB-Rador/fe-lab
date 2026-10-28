"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/src/lib/apiClient"
import { toast } from "sonner"
import ReportsView from "./reports.view"
import type { ReportDraft, ReportResult, ReportSource, ReportsCatalog, SavedReport } from "./types"

const defaultColumns: Record<ReportSource, string[]> = {
    ANIMAL: ["identifier", "name", "status", "lastRecordDate"],
    EXPERIMENT: ["title", "status", "startDate", "endDate", "animalCount"],
    TASK: ["title", "status", "assignee", "dueDate"],
}

function emptyDraft(source: ReportSource = "ANIMAL"): ReportDraft {
    return { id: null, name: "", source, columns: defaultColumns[source], statusFilter: "" }
}

function messageFrom(error: unknown, fallback: string) {
    const text = error instanceof Error ? error.message : ""
    if (text.includes("409")) return "A report with this name already exists."
    if (text.includes("400")) return "Choose a name and at least one column."
    return fallback
}

export default function ReportsContainer({
    userId,
    labId,
    catalog,
    error,
}: {
    userId: string
    labId: string
    catalog: ReportsCatalog | null
    error: string | null
}) {
    const [reports, setReports] = useState<SavedReport[]>(catalog?.reports ?? [])
    const [draft, setDraft] = useState<ReportDraft>(emptyDraft())
    const [result, setResult] = useState<ReportResult | null>(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [busy, setBusy] = useState(false)

    useEffect(() => {
        if (error) toast.error(error)
    }, [error])

    const replaceResult = (next: ReportResult | null) => {
        setResult(next)
        setPage(1)
    }

    const fields = catalog?.fields
    const statuses = catalog?.statuses
    const base = `/api/reports/${userId}/${labId}`

    const body = {
        name: draft.name,
        source: draft.source,
        columns: draft.columns,
        statusFilter: draft.statusFilter || null,
    }

    const updateDraft = (patch: Partial<ReportDraft>) => {
        setDraft((current) => ({ ...current, ...patch }))
    }

    const changeSource = (source: ReportSource) => {
        setDraft({ id: null, name: draft.name, source, columns: defaultColumns[source], statusFilter: "" })
        replaceResult(null)
    }

    const toggleColumn = (key: string) => {
        setDraft((current) => ({
            ...current,
            columns: current.columns.includes(key)
                ? current.columns.filter((column) => column !== key)
                : [...current.columns, key],
        }))
    }

    const fail = (message: string, id?: string | number) => {
        toast.error(message, id === undefined ? undefined : { id })
    }

    const generate = async (load: () => Promise<ReportResult | null>) => {
        const id = toast.loading("Generating report")
        try {
            const next = await load()
            if (!next) {
                fail("Could not generate the report.", id)
                return
            }
            replaceResult(next)
            toast.success("Report ready", {
                id,
                description: `${next.rows.length} ${next.rows.length === 1 ? "row" : "rows"}`,
            })
        } catch (cause) {
            fail(messageFrom(cause, "Could not generate the report."), id)
        }
    }

    const preview = async () => {
        if (!draft.columns.length) {
            fail("Choose at least one column.")
            return
        }
        setBusy(true)
        try {
            await generate(async () => {
                const response = await apiClient.post(`${base}/preview`, body) as { success?: boolean; data?: ReportResult }
                return response?.success && response.data ? response.data : null
            })
        } finally {
            setBusy(false)
        }
    }

    const save = async () => {
        if (!draft.name.trim() || !draft.columns.length) {
            fail("Choose a name and at least one column.")
            return
        }
        setBusy(true)
        const creating = draft.id === null
        try {
            const response = draft.id
                ? await apiClient.put(`${base}/${draft.id}`, body) as { success?: boolean; data?: SavedReport }
                : await apiClient.post(base, body) as { success?: boolean; data?: SavedReport }
            if (!response?.success || !response.data) {
                fail("Could not save the report.")
                return
            }
            const saved = response.data
            setReports((current) => [saved, ...current.filter((report) => report.id !== saved.id)])
            setDraft({
                id: saved.id,
                name: saved.name,
                source: saved.source,
                columns: saved.columns,
                statusFilter: saved.statusFilter ?? "",
            })
            toast.success(creating ? "Report created" : "Report updated", { description: saved.name })
            await generate(() => loadSavedResult(saved.id))
        } catch (cause) {
            fail(messageFrom(cause, "Could not save the report."))
        } finally {
            setBusy(false)
        }
    }

    const loadSavedResult = async (reportId: string) => {
        const response = await apiClient.get(`${base}/${reportId}`) as {
            success?: boolean
            data?: { report: SavedReport; result: ReportResult }
        }
        return response?.success && response.data ? response.data.result : null
    }

    const openReport = async (report: SavedReport) => {
        setDraft({
            id: report.id,
            name: report.name,
            source: report.source,
            columns: report.columns,
            statusFilter: report.statusFilter ?? "",
        })
        setBusy(true)
        try {
            await generate(() => loadSavedResult(report.id))
        } finally {
            setBusy(false)
        }
    }

    const remove = async () => {
        if (!draft.id) return
        const name = draft.name
        setBusy(true)
        try {
            await apiClient.delete(`${base}/${draft.id}`)
            setReports((current) => current.filter((report) => report.id !== draft.id))
            setDraft(emptyDraft(draft.source))
            replaceResult(null)
            toast.success("Report deleted", { description: name })
        } catch (cause) {
            fail(messageFrom(cause, "Could not delete the report."))
        } finally {
            setBusy(false)
        }
    }

    const exportCsv = () => {
        if (!result) return
        const header = result.columns.map((column) => csvCell(column.label)).join(",")
        const lines = result.rows.map((row) => result.columns.map((column) => csvCell(row[column.key] ?? "")).join(","))
        const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `${(draft.name.trim() || "report").toLowerCase().replace(/\s+/g, "-")}.csv`
        anchor.click()
        URL.revokeObjectURL(url)
    }

    return (
        <ReportsView
            reports={reports}
            fields={fields?.[draft.source] ?? []}
            statuses={statuses?.[draft.source] ?? []}
            draft={draft}
            result={result}
            page={page}
            pageSize={pageSize}
            busy={busy}
            onNew={() => {
                setDraft(emptyDraft())
                replaceResult(null)
            }}
            onPageChange={setPage}
            onPageSizeChange={(next) => {
                setPageSize(next)
                setPage(1)
            }}
            onOpen={(report) => void openReport(report)}
            onName={(name) => updateDraft({ name })}
            onSource={changeSource}
            onStatus={(statusFilter) => updateDraft({ statusFilter })}
            onToggleColumn={toggleColumn}
            onPreview={() => void preview()}
            onSave={() => void save()}
            onDelete={() => void remove()}
            onExport={exportCsv}
        />
    )
}

function csvCell(value: string) {
    if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
    return value
}
