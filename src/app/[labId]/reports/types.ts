export type ReportSource = "ANIMAL" | "EXPERIMENT" | "TASK"

export interface ReportField {
    key: string
    label: string
}

export interface SavedReport {
    id: string
    name: string
    source: ReportSource
    columns: string[]
    statusFilter: string | null
    updatedAt: string
    createdByName: string
}

export interface ReportResult {
    columns: ReportField[]
    rows: Record<string, string>[]
}

export interface ReportsCatalog {
    reports: SavedReport[]
    fields: Record<ReportSource, ReportField[]>
    statuses: Record<ReportSource, string[]>
}

export interface ReportDraft {
    id: string | null
    name: string
    source: ReportSource
    columns: string[]
    statusFilter: string
}
