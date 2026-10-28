import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/src/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Download, Eye, Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { cn } from "@/src/lib/utils"
import type { ReportDraft, ReportField, ReportResult, ReportSource, SavedReport } from "./types"

const sources: { value: ReportSource; label: string }[] = [
    { value: "ANIMAL", label: "Animals" },
    { value: "EXPERIMENT", label: "Experiments" },
    { value: "TASK", label: "Tasks" },
]

const pageSizeOptions = [5, 10, 20, 50]

const badgeClass: Record<string, string> = {
    ACTIVE: "border-green-200 bg-green-100 text-green-800",
    BREEDING: "border-indigo-200 bg-indigo-100 text-indigo-800",
    QUARANTINE: "border-yellow-200 bg-yellow-100 text-yellow-800",
    EXPERIMENT: "border-blue-200 bg-blue-100 text-blue-800",
    RETIRED: "border-gray-200 bg-gray-100 text-gray-800",
    DECEASED: "border-red-200 bg-red-100 text-red-800",
    TRANSFERRED: "border-purple-200 bg-purple-100 text-purple-800",
    PLANNED: "border-yellow-200 bg-yellow-100 text-yellow-800",
    PAUSED: "border-purple-200 bg-purple-100 text-purple-800",
    COMPLETED: "border-blue-200 bg-blue-100 text-blue-800",
    CANCELLED: "border-red-200 bg-red-100 text-red-800",
    PENDING: "border-slate-200 bg-slate-50 text-slate-800",
    IN_PROGRESS: "border-blue-200 bg-blue-50 text-blue-950",
    LOW: "border-slate-200 bg-slate-50 text-slate-800",
    MEDIUM: "border-amber-200 bg-amber-50 text-amber-950",
    HIGH: "border-orange-300 bg-orange-50 text-orange-950",
    URGENT: "border-red-300 bg-red-50 text-red-950",
    MALE: "border-blue-200 bg-blue-50 text-blue-800",
    FEMALE: "border-pink-200 bg-pink-50 text-pink-800",
    UNKNOWN: "border-gray-200 bg-gray-100 text-gray-800",
    ROUTINE_CHECK: "border-slate-200 bg-slate-50 text-slate-800",
    MEDICATION: "border-blue-200 bg-blue-50 text-blue-950",
    SAMPLING: "border-indigo-200 bg-indigo-50 text-indigo-950",
    OBSERVATION: "border-gray-200 bg-gray-50 text-gray-800",
    TREATMENT: "border-green-200 bg-green-50 text-green-950",
    EMERGENCY: "border-red-200 bg-red-50 text-red-950",
}

function labelFromEnum(value: string) {
    return value
        .toLowerCase()
        .split("_")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
}

function formatDate(value: string) {
    const [year, month, day] = value.split("-").map(Number)
    if (!year || !month || !day) return value
    return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    })
}

function pageNumbersFor(currentPage: number, totalPages: number) {
    const pages = []
    const startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)
    const first = Math.max(1, endPage - 4)
    for (let page = first; page <= endPage; page += 1) pages.push(page)
    return pages
}

export default function ReportsView({
    reports,
    fields,
    statuses,
    draft,
    result,
    page,
    pageSize,
    busy,
    onNew,
    onOpen,
    onName,
    onSource,
    onStatus,
    onToggleColumn,
    onPreview,
    onSave,
    onDelete,
    onExport,
    onPageChange,
    onPageSizeChange,
}: {
    reports: SavedReport[]
    fields: ReportField[]
    statuses: string[]
    draft: ReportDraft
    result: ReportResult | null
    page: number
    pageSize: number
    busy: boolean
    onNew: () => void
    onOpen: (report: SavedReport) => void
    onName: (name: string) => void
    onSource: (source: ReportSource) => void
    onStatus: (status: string) => void
    onToggleColumn: (key: string) => void
    onPreview: () => void
    onSave: () => void
    onDelete: () => void
    onExport: () => void
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
}) {
    const totalCount = result?.rows.length ?? 0
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
    const currentPage = Math.min(page, totalPages)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, totalCount)
    const visibleRows = result?.rows.slice(startIndex, endIndex) ?? []
    const pageNumbers = pageNumbersFor(currentPage, totalPages)
    const hasPreviousPage = currentPage > 1
    const hasNextPage = currentPage < totalPages

    const renderCell = (key: string, value: string) => {
        if (!value) return "—"
        if (key.endsWith("Date")) return formatDate(value)
        if (key === "status" || key === "sex" || key === "priority" || key === "lastRecordType") {
            return (
                <Badge variant="outline" className={cn("font-medium", badgeClass[value] ?? "border-gray-200 bg-gray-50 text-gray-800")}>
                    {labelFromEnum(value)}
                </Badge>
            )
        }
        return value
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
                    <p className="text-gray-500">Build a table from laboratory animals, experiments, or tasks, then save it.</p>
                </div>
                <Button type="button" onClick={onNew} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    New report
                </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                <Card>
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="text-lg">Saved reports</CardTitle>
                        <CardDescription>
                            {reports.length === 0 ? "None yet" : `${reports.length} saved`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2 p-4">
                        {reports.length === 0 ? (
                            <p className="py-6 text-center text-sm text-gray-500">No saved reports yet.</p>
                        ) : reports.map((report) => (
                            <button
                                key={report.id}
                                type="button"
                                onClick={() => onOpen(report)}
                                className={cn(
                                    "w-full rounded-lg border px-3 py-2 text-left transition-colors hover:bg-gray-50",
                                    draft.id === report.id ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white",
                                )}
                            >
                                <p className="text-sm font-medium text-gray-900">{report.name}</p>
                                <p className="text-xs text-gray-500">
                                    {sources.find((source) => source.value === report.source)?.label} · {report.createdByName}
                                </p>
                            </button>
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg">{draft.id ? "Edit report" : "New report"}</CardTitle>
                            <CardDescription>Pick a source, the columns to show, and an optional status.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 p-6">
                            <div className="space-y-2">
                                <Label htmlFor="report-name">Name</Label>
                                <Input
                                    id="report-name"
                                    value={draft.name}
                                    onChange={(event) => onName(event.target.value)}
                                    placeholder="Report name"
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Source</Label>
                                    <Select value={draft.source} onValueChange={(value) => onSource(value as ReportSource)}>
                                        <SelectTrigger aria-label="Report source">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sources.map((source) => (
                                                <SelectItem key={source.value} value={source.value}>{source.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select value={draft.statusFilter || "ALL"} onValueChange={(value) => onStatus(value === "ALL" ? "" : value)}>
                                        <SelectTrigger aria-label="Status filter">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All statuses</SelectItem>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>{labelFromEnum(status)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Columns</Label>
                                <div className="grid gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:grid-cols-2">
                                    {fields.map((field) => (
                                        <label key={field.key} className="flex items-center gap-2 text-sm text-gray-700">
                                            <Checkbox
                                                checked={draft.columns.includes(field.key)}
                                                onCheckedChange={() => onToggleColumn(field.key)}
                                            />
                                            {field.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button type="button" variant="outline" onClick={onPreview} disabled={busy || draft.columns.length === 0}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Preview
                                </Button>
                                <Button
                                    type="button"
                                    onClick={onSave}
                                    disabled={busy || !draft.name.trim() || draft.columns.length === 0}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {draft.id ? "Save changes" : "Save report"}
                                </Button>
                                {result ? (
                                    <Button type="button" variant="outline" onClick={onExport}>
                                        <Download className="mr-2 h-4 w-4" />
                                        Export CSV
                                    </Button>
                                ) : null}
                                {draft.id ? (
                                    <Button type="button" variant="outline" onClick={onDelete} disabled={busy}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </Button>
                                ) : null}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-lg">Result</CardTitle>
                            <CardDescription>
                                {result ? `${result.rows.length} rows` : "Preview a report to see its rows."}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            {result && result.rows.length > 0 ? (
                                <>
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                {result.columns.map((column) => (
                                                    <TableHead key={column.key} className="text-gray-700">{column.label}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {visibleRows.map((row, index) => (
                                                <TableRow key={`${row.identifier ?? row.title ?? "row"}-${startIndex + index}`}>
                                                    {result.columns.map((column, columnIndex) => (
                                                        <TableCell
                                                            key={column.key}
                                                            className={cn(
                                                                "max-w-xs whitespace-pre-wrap",
                                                                columnIndex === 0 && "font-medium text-gray-900",
                                                            )}
                                                        >
                                                            {renderCell(column.key, row[column.key] ?? "")}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                    <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                            <span className="text-sm text-gray-700">
                                                Showing {startIndex + 1} to {endIndex} of {totalCount} entries
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-700">Rows per page:</span>
                                                <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
                                                    <SelectTrigger className="h-8 w-20" aria-label="Rows per page">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {pageSizeOptions.map((option) => (
                                                            <SelectItem key={option} value={String(option)}>{option}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        {totalPages > 1 ? (
                                            <div className="flex justify-center sm:justify-end">
                                                <Pagination>
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious
                                                                href="#"
                                                                onClick={(event) => {
                                                                    event.preventDefault()
                                                                    if (hasPreviousPage) onPageChange(currentPage - 1)
                                                                }}
                                                                className={!hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                                                            />
                                                        </PaginationItem>
                                                        {pageNumbers[0] > 1 ? (
                                                            <>
                                                                <PaginationItem>
                                                                    <PaginationLink href="#" onClick={(event) => { event.preventDefault(); onPageChange(1) }}>
                                                                        1
                                                                    </PaginationLink>
                                                                </PaginationItem>
                                                                {pageNumbers[0] > 2 ? (
                                                                    <PaginationItem>
                                                                        <PaginationEllipsis />
                                                                    </PaginationItem>
                                                                ) : null}
                                                            </>
                                                        ) : null}
                                                        {pageNumbers.map((pageNumber) => (
                                                            <PaginationItem key={pageNumber}>
                                                                <PaginationLink
                                                                    href="#"
                                                                    onClick={(event) => { event.preventDefault(); onPageChange(pageNumber) }}
                                                                    isActive={currentPage === pageNumber}
                                                                >
                                                                    {pageNumber}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        ))}
                                                        {pageNumbers[pageNumbers.length - 1] < totalPages ? (
                                                            <>
                                                                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 ? (
                                                                    <PaginationItem>
                                                                        <PaginationEllipsis />
                                                                    </PaginationItem>
                                                                ) : null}
                                                                <PaginationItem>
                                                                    <PaginationLink href="#" onClick={(event) => { event.preventDefault(); onPageChange(totalPages) }}>
                                                                        {totalPages}
                                                                    </PaginationLink>
                                                                </PaginationItem>
                                                            </>
                                                        ) : null}
                                                        <PaginationItem>
                                                            <PaginationNext
                                                                href="#"
                                                                onClick={(event) => {
                                                                    event.preventDefault()
                                                                    if (hasNextPage) onPageChange(currentPage + 1)
                                                                }}
                                                                className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                                                            />
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            </div>
                                        ) : null}
                                    </div>
                                </>
                            ) : (
                                <p className="px-6 py-10 text-center text-sm text-gray-500">
                                    {result ? "No rows match this report." : "No preview yet."}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
