"use client"

import { Card, CardContent } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import {
    BarChart,
    LineChart,
    PieChart,
    ResponsiveContainer,
    Bar,
    Line,
    Pie,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    Cell,
    Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/src/components/ui/chart"
import type { LaboratoryReports } from "@/src/app/[labId]/reports/types"

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"]

function EmptyState({ message }: { message: string }) {
    return (
        <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground text-center px-4">
            {message}
        </div>
    )
}

export default function KeyMetricsCharts({ reports }: { reports: LaboratoryReports }) {
    const experimentChartData = reports.experimentProgress.map((row, index) => ({
        name: row.name.length > 12 ? `${row.name.slice(0, 12)}…` : row.name,
        progress: row.progress,
        fullName: row.name,
        index: index + 1,
    }))

    return (
        <div className="space-y-4">
            <Tabs defaultValue="animal-health" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="animal-health">Animal Health</TabsTrigger>
                    <TabsTrigger value="task-completion">Task Completion</TabsTrigger>
                </TabsList>

                <TabsContent value="animal-health" className="mt-4">
                    <Card>
                        <CardContent className="p-4">
                            {reports.animalHealth.length === 0 ? (
                                <EmptyState message="No animals to chart yet." />
                            ) : (
                                <ChartContainer
                                    config={{
                                        healthy: {
                                            label: "Healthy",
                                            color: "hsl(var(--chart-1))",
                                        },
                                        attention: {
                                            label: "Attention",
                                            color: "hsl(var(--chart-2))",
                                        },
                                    }}
                                    className="h-[200px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reports.animalHealth}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="healthy" fill="var(--color-healthy)" />
                                            <Bar dataKey="attention" fill="var(--color-attention)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="task-completion" className="mt-4">
                    <Card>
                        <CardContent className="p-4">
                            {reports.taskCompletion.every(
                                (row) => row.completed === 0 && row.pending === 0,
                            ) ? (
                                <EmptyState message="No task activity in the last 7 days." />
                            ) : (
                                <ChartContainer
                                    config={{
                                        completed: {
                                            label: "Completed",
                                            color: "hsl(var(--chart-1))",
                                        },
                                        pending: {
                                            label: "Pending",
                                            color: "hsl(var(--chart-2))",
                                        },
                                    }}
                                    className="h-[200px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={reports.taskCompletion}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Bar dataKey="completed" fill="var(--color-completed)" />
                                            <Bar dataKey="pending" fill="var(--color-pending)" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Tabs defaultValue="experiment-progress" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="experiment-progress">Experiment Progress</TabsTrigger>
                    <TabsTrigger value="lab-activity">Lab Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="experiment-progress" className="mt-4">
                    <Card>
                        <CardContent className="p-4">
                            {experimentChartData.length === 0 ? (
                                <EmptyState message="No experiments to chart yet." />
                            ) : (
                                <ChartContainer
                                    config={{
                                        progress: {
                                            label: "Progress",
                                            color: "hsl(var(--chart-1))",
                                        },
                                    }}
                                    className="h-[200px]"
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={experimentChartData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis domain={[0, 100]} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Legend />
                                            <Line
                                                type="monotone"
                                                dataKey="progress"
                                                stroke="var(--color-progress)"
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="lab-activity" className="mt-4">
                    <Card>
                        <CardContent className="p-4">
                            {reports.labActivity.length === 0 ? (
                                <EmptyState message="No laboratory activity to chart yet." />
                            ) : (
                                <div className="h-[200px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={reports.labActivity}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) =>
                                                    `${name} ${(percent * 100).toFixed(0)}%`
                                                }
                                            >
                                                {reports.labActivity.map((entry, index) => (
                                                    <Cell
                                                        key={`${entry.name}-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
