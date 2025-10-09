import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Download, Plus, BarChart } from "lucide-react"
import ReportTemplates from "@/src/components/reports/report-templates"
import ReportBuilder from "@/src/components/reports/report-builder"
import KeyMetricsCharts from "@/src/components/reports/key-metrics-charts"

export default function ReportsPage() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
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
                            <ReportTemplates />
                        </TabsContent>

                        <TabsContent value="builder" className="mt-4">
                            <ReportBuilder />
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
                            <KeyMetricsCharts />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
