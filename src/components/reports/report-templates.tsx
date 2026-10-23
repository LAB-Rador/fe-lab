"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import {
    FileText,
    BarChart2,
    LineChart,
    Users,
    Calendar,
    Clock,
    Star,
    HeartPulse,
} from "lucide-react"
import { REPORT_TEMPLATE_META } from "@/src/app/[labId]/reports/build-report"
import type { LaboratoryReports, ReportTemplateId } from "@/src/app/[labId]/reports/types"

const icons: Record<ReportTemplateId, ReactNode> = {
    "animal-health": <HeartPulse className="h-5 w-5 text-primary" />,
    "experiment-progress": <LineChart className="h-5 w-5 text-primary" />,
    "task-completion": <Calendar className="h-5 w-5 text-primary" />,
    "lab-activity": <BarChart2 className="h-5 w-5 text-primary" />,
    "staff-performance": <Users className="h-5 w-5 text-primary" />,
    breeding: <Users className="h-5 w-5 text-primary" />,
}

function formatLastRun(value: string | null) {
    if (!value) return "Never"
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "Never"
    const diffMs = Date.now() - date.getTime()
    const dayMs = 24 * 60 * 60 * 1000
    if (diffMs < dayMs) return "Today"
    if (diffMs < 2 * dayMs) return "Yesterday"
    const days = Math.floor(diffMs / dayMs)
    if (days < 14) return `${days} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ReportTemplates({
    reports,
    onGenerate,
}: {
    reports: LaboratoryReports
    onGenerate: (templateId: ReportTemplateId, title?: string) => void
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REPORT_TEMPLATE_META.map((template) => (
                <Card key={template.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-lg flex items-center gap-2">
                                {icons[template.id]}
                                {template.title}
                            </CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                        </div>
                        {template.popular ? (
                            <Badge className="bg-status-purple">
                                <Star className="h-3 w-3 mr-1" /> Popular
                            </Badge>
                        ) : null}
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-4 w-4 mr-1" /> Last activity:{" "}
                            {formatLastRun(reports.activityDates[template.activityKey])}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => onGenerate(template.id, template.title)}
                        >
                            <FileText className="h-4 w-4 mr-2" /> Preview
                        </Button>
                        <Button
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            type="button"
                            onClick={() => onGenerate(template.id, template.title)}
                        >
                            Generate Report
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
