"use client"

import { useMemo, useState } from "react"
import { buildReportFromTemplate, reportsToExportText } from "./build-report"
import type { GeneratedReport, LaboratoryReports, ReportTemplateId } from "./types"
import ReportsView from "./reports.view"

export default function ReportsContainer({
    labId,
    reports,
}: {
    labId: string
    reports: LaboratoryReports
}) {
    const [preview, setPreview] = useState<GeneratedReport | null>(null)
    const [previewOpen, setPreviewOpen] = useState(false)

    const hasData = useMemo(() => {
        const { summary } = reports
        return (
            summary.animalCount > 0 ||
            summary.experimentCount > 0 ||
            summary.taskCount > 0 ||
            summary.breedingCount > 0 ||
            summary.recordCount > 0
        )
    }, [reports])

    const openReport = (templateId: ReportTemplateId | "custom", title?: string) => {
        const report = buildReportFromTemplate(templateId, reports, title)
        setPreview(report)
        setPreviewOpen(true)
    }

    const exportLatest = () => {
        const report = preview ?? buildReportFromTemplate("custom", reports, "Laboratory Overview")
        const blob = new Blob([reportsToExportText(report)], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `${report.title.toLowerCase().replace(/\s+/g, "-")}.txt`
        anchor.click()
        URL.revokeObjectURL(url)
    }

    return (
        <ReportsView
            labId={labId}
            reports={reports}
            hasData={hasData}
            preview={preview}
            previewOpen={previewOpen}
            onPreviewOpenChange={setPreviewOpen}
            onGenerate={openReport}
            onExport={exportLatest}
        />
    )
}
