"use client"

import { useMemo, useState, type ReactNode } from "react"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { BarChart, PieChart, LineChart } from "lucide-react"
import type { LaboratoryReports, ReportTemplateId } from "@/src/app/[labId]/reports/types"

const TYPE_OPTIONS: Array<{ value: ReportTemplateId | "custom"; label: string }> = [
    { value: "animal-health", label: "Animal Health" },
    { value: "experiment-progress", label: "Experiment" },
    { value: "task-completion", label: "Task Management" },
    { value: "lab-activity", label: "Laboratory Activity" },
    { value: "staff-performance", label: "Staff Performance" },
    { value: "breeding", label: "Breeding" },
    { value: "custom", label: "Custom" },
]

export default function ReportBuilder({
    reports,
    onGenerate,
}: {
    reports: LaboratoryReports
    onGenerate: (templateId: ReportTemplateId | "custom", title?: string) => void
}) {
    const [name, setName] = useState("")
    const [reportType, setReportType] = useState<ReportTemplateId | "custom">("custom")
    const [includeAnimals, setIncludeAnimals] = useState(true)
    const [includeExperiments, setIncludeExperiments] = useState(true)
    const [includeTasks, setIncludeTasks] = useState(true)
    const [includeBreedings, setIncludeBreedings] = useState(false)

    const filters = useMemo(() => {
        const chips: string[] = []
        if (includeAnimals) chips.push(`${reports.summary.animalCount} animals`)
        if (includeExperiments) chips.push(`${reports.summary.experimentCount} experiments`)
        if (includeTasks) chips.push(`${reports.summary.taskCount} tasks`)
        if (includeBreedings) chips.push(`${reports.summary.breedingCount} breedings`)
        return chips
    }, [includeAnimals, includeExperiments, includeTasks, includeBreedings, reports.summary])

    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Report Parameters</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="report-name">Report Name</Label>
                                <Input
                                    id="report-name"
                                    placeholder="Enter report name"
                                    value={name}
                                    onChange={(event) => setName(event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="report-type">Report Type</Label>
                                <Select
                                    value={reportType}
                                    onValueChange={(value) =>
                                        setReportType(value as ReportTemplateId | "custom")
                                    }
                                >
                                    <SelectTrigger id="report-type">
                                        <SelectValue placeholder="Select report type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {TYPE_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Included data</Label>
                            <div className="flex flex-wrap gap-2">
                                {filters.map((label) => (
                                    <div
                                        key={label}
                                        className="text-xs px-2 py-1 rounded-full border bg-primary/10 text-primary border-primary/20"
                                    >
                                        {label}
                                    </div>
                                ))}
                                {filters.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        Select at least one data source below.
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Report Components</h3>

                        <Tabs defaultValue="charts" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="charts">Charts</TabsTrigger>
                                <TabsTrigger value="tables">Tables</TabsTrigger>
                                <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
                            </TabsList>

                            <TabsContent value="charts" className="mt-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ChartOption
                                        icon={<BarChart className="h-5 w-5 text-primary" />}
                                        title="Animal Health"
                                        description="Healthy vs attention by type"
                                    />
                                    <ChartOption
                                        icon={<LineChart className="h-5 w-5 text-primary" />}
                                        title="Experiment Progress"
                                        description="Status-based progress scores"
                                    />
                                    <ChartOption
                                        icon={<PieChart className="h-5 w-5 text-primary" />}
                                        title="Lab Activity"
                                        description="Share of laboratory records"
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="tables" className="mt-4">
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="table-animals"
                                            checked={includeAnimals}
                                            onCheckedChange={(checked) =>
                                                setIncludeAnimals(checked === true)
                                            }
                                        />
                                        <Label htmlFor="table-animals">Animal Records</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="table-experiments"
                                            checked={includeExperiments}
                                            onCheckedChange={(checked) =>
                                                setIncludeExperiments(checked === true)
                                            }
                                        />
                                        <Label htmlFor="table-experiments">Experiment Data</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="table-tasks"
                                            checked={includeTasks}
                                            onCheckedChange={(checked) =>
                                                setIncludeTasks(checked === true)
                                            }
                                        />
                                        <Label htmlFor="table-tasks">Task Summary</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="table-breedings"
                                            checked={includeBreedings}
                                            onCheckedChange={(checked) =>
                                                setIncludeBreedings(checked === true)
                                            }
                                        />
                                        <Label htmlFor="table-breedings">Breeding Summary</Label>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="metrics" className="mt-4">
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>Healthy animals: {reports.summary.healthyAnimals}</p>
                                    <p>Open tasks: {reports.summary.openTasks}</p>
                                    <p>Active experiments: {reports.summary.activeExperiments}</p>
                                    <p>Active members: {reports.summary.memberCount}</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button
                            className="bg-primary hover:bg-primary/90"
                            type="button"
                            onClick={() => onGenerate(reportType, name || undefined)}
                        >
                            Generate Report
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function ChartOption({
    icon,
    title,
    description,
}: {
    icon: ReactNode
    title: string
    description: string
}) {
    return (
        <div className="flex items-start gap-3 p-3 border rounded-md bg-muted/20">
            <div className="mt-0.5">{icon}</div>
            <div>
                <h4 className="font-medium">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    )
}
