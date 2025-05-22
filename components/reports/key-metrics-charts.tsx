"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
    Tooltip,
    Legend,
    Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Sample data for charts
const animalHealthData = [
    { name: "Mice", healthy: 85, sick: 15 },
    { name: "Fish", healthy: 92, sick: 8 },
    { name: "Birds", healthy: 78, sick: 22 },
]

const taskCompletionData = [
    { name: "Mon", completed: 12, pending: 5 },
    { name: "Tue", completed: 19, pending: 3 },
    { name: "Wed", completed: 15, pending: 8 },
    { name: "Thu", completed: 21, pending: 4 },
    { name: "Fri", completed: 18, pending: 6 },
]

const experimentProgressData = [
    { name: "Week 1", progress: 20 },
    { name: "Week 2", progress: 35 },
    { name: "Week 3", progress: 48 },
    { name: "Week 4", progress: 62 },
    { name: "Week 5", progress: 75 },
    { name: "Week 6", progress: 88 },
]

const resourceUtilizationData = [
    { name: "Equipment", value: 35 },
    { name: "Supplies", value: 25 },
    { name: "Staff", value: 30 },
    { name: "Space", value: 10 },
]

const COLORS = ["#2563EB", "#10B981", "#F59E0B", "#8B5CF6"]

export default function KeyMetricsCharts() {
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
                <ChartContainer
                    config={{
                    healthy: {
                        label: "Healthy",
                        color: "hsl(var(--chart-1))",
                    },
                    sick: {
                        label: "Sick",
                        color: "hsl(var(--chart-2))",
                    },
                    }}
                    className="h-[200px]"
                >
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={animalHealthData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="healthy" fill="var(--color-healthy)" />
                        <Bar dataKey="sick" fill="var(--color-sick)" />
                    </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="task-completion" className="mt-4">
            <Card>
                <CardContent className="p-4">
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
                    <BarChart data={taskCompletionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="completed" fill="var(--color-completed)" />
                        <Bar dataKey="pending" fill="var(--color-pending)" />
                    </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>

        <Tabs defaultValue="experiment-progress" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="experiment-progress">Experiment Progress</TabsTrigger>
            <TabsTrigger value="resource-utilization">Resource Utilization</TabsTrigger>
            </TabsList>

            <TabsContent value="experiment-progress" className="mt-4">
            <Card>
                <CardContent className="p-4">
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
                    <LineChart data={experimentProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="progress" stroke="var(--color-progress)" />
                    </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
                </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="resource-utilization" className="mt-4">
            <Card>
                <CardContent className="p-4">
                <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={resourceUtilizationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                        {resourceUtilizationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                </CardContent>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
    )
}
