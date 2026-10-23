"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Download } from "lucide-react"
import type { GeneratedReport } from "@/src/app/[labId]/reports/types"
import { reportsToExportText } from "@/src/app/[labId]/reports/build-report"

export function ReportPreviewDialog({
    report,
    open,
    onOpenChange,
}: {
    report: GeneratedReport | null
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const handleExport = () => {
        if (!report) return
        const blob = new Blob([reportsToExportText(report)], { type: "text/plain;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `${report.title.toLowerCase().replace(/\s+/g, "-")}.txt`
        anchor.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{report?.title ?? "Report"}</DialogTitle>
                    <DialogDescription>
                        {report
                            ? `Generated ${new Date(report.generatedAt).toLocaleString()}`
                            : "No report selected"}
                    </DialogDescription>
                </DialogHeader>
                {report ? (
                    <div className="space-y-4 text-sm">
                        <div>
                            <h4 className="font-medium mb-2">Summary</h4>
                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                {report.summaryLines.map((line) => (
                                    <li key={line}>{line}</li>
                                ))}
                            </ul>
                        </div>
                        {report.sections.map((section) => (
                            <div key={section.heading}>
                                <h4 className="font-medium mb-2">{section.heading}</h4>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    {section.rows.map((row) => (
                                        <li key={`${section.heading}-${row}`}>{row}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                ) : null}
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button type="button" onClick={handleExport} disabled={!report}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
