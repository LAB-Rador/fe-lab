import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Download, Plus, BarChart } from "lucide-react"
import ReportTemplates from "@/src/components/reports/report-templates"
import ReportBuilder from "@/src/components/reports/report-builder"
import KeyMetricsCharts from "@/src/components/reports/key-metrics-charts"
import { ReportPreviewDialog } from "@/src/components/reports/report-preview-dialog"
import type { GeneratedReport, LaboratoryReports, ReportTemplateId } from "./types"

export default function ReportsView({
    reports,
    hasData,
    preview,
    previewOpen,
    onPreviewOpenChange,
    onGenerate,
    onExport,
}: {
    labId: string
    reports: LaboratoryReports
    hasData: boolean
    preview: GeneratedReport | null
    previewOpen: boolean
    onPreviewOpenChange: (open: boolean) => void
    onGenerate: (templateId: ReportTemplateId | "custom", title?: string) => void
    onExport: () => void
}) {
    const { summary } = reports

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap justify-between items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
                    <p className="text-sm text-muted-foreground">
                        {hasData
                            ? `${summary.animalCount} animals · ${summary.experimentCount} experiments · ${summary.taskCount} tasks`
                            : "No laboratory activity yet. Reports will fill in as data is added."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" type="button" onClick={onExport}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button
                        className="bg-primary hover:bg-primary/90"
                        type="button"
                        onClick={() => onGenerate("custom", "Laboratory Overview")}
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Report
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <Tabs defaultValue="templates" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="templates">Report Templates</TabsTrigger>
                            <TabsTrigger value="builder">Custom Report Builder</TabsTrigger>
                        </TabsList>

                        <TabsContent value="templates" className="mt-4">
                            <ReportTemplates reports={reports} onGenerate={onGenerate} />
                        </TabsContent>

                        <TabsContent value="builder" className="mt-4">
                            <ReportBuilder reports={reports} onGenerate={onGenerate} />
                        </TabsContent>
                    </Tabs>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                                <BarChart className="mr-2 h-5 w-5" />
                                Key Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <KeyMetricsCharts reports={reports} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <ReportPreviewDialog
                report={preview}
                open={previewOpen}
                onOpenChange={onPreviewOpenChange}
            />
        </div>
    )
}
