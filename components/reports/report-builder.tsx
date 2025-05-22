import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Filter, Save, BarChart, PieChart, LineChart } from "lucide-react"

export default function ReportBuilder() {
    return (
        <Card>
        <CardContent className="p-6">
            <div className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Report Parameters</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="report-name">Report Name</Label>
                            <Input id="report-name" placeholder="Enter report name" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="report-type">Report Type</Label>
                            <Select>
                                <SelectTrigger id="report-type">
                                    <SelectValue placeholder="Select report type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="animal-health">Animal Health</SelectItem>
                                    <SelectItem value="experiment">Experiment</SelectItem>
                                    <SelectItem value="inventory">Inventory</SelectItem>
                                    <SelectItem value="task">Task Management</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date-range">Date Range</Label>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Calendar className="h-4 w-4 mr-2" /> Start Date
                                </Button>
                                <span>to</span>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Calendar className="h-4 w-4 mr-2" /> End Date
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="frequency">Schedule Frequency</Label>
                            <Select>
                                <SelectTrigger id="frequency">
                                    <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="once">One-time</SelectItem>
                                    <SelectItem value="daily">Daily</SelectItem>
                                    <SelectItem value="weekly">Weekly</SelectItem>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Data Filters</Label>
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" /> Add Filter
                            </Button>
                            <Badge type="animal" label="Mice" />
                            <Badge type="status" label="Healthy" />
                            <Badge type="experiment" label="Active" />
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
                                title="Bar Chart"
                                description="Compare values across categories"
                            />
                            <ChartOption
                                icon={<LineChart className="h-5 w-5 text-primary" />}
                                title="Line Chart"
                                description="Show trends over time"
                            />
                            <ChartOption
                                icon={<PieChart className="h-5 w-5 text-primary" />}
                                title="Pie Chart"
                                description="Show proportion of categories"
                            />
                            </div>
                        </TabsContent>

                        <TabsContent value="tables" className="mt-4">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="table-animals" />
                                    <Label htmlFor="table-animals">Animal Records</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="table-experiments" />
                                    <Label htmlFor="table-experiments">Experiment Data</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="table-tasks" />
                                    <Label htmlFor="table-tasks">Task Summary</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="table-inventory" />
                                    <Label htmlFor="table-inventory">Inventory Status</Label>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="metrics" className="mt-4">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="metric-health" />
                                    <Label htmlFor="metric-health">Health Indicators</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="metric-completion" />
                                    <Label htmlFor="metric-completion">Task Completion Rate</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="metric-growth" />
                                    <Label htmlFor="metric-growth">Population Growth</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="metric-usage" />
                                    <Label htmlFor="metric-usage">Resource Utilization</Label>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline">
                        <Save className="h-4 w-4 mr-2" /> Save Template
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">Generate Report</Button>
                </div>
            </div>
        </CardContent>
        </Card>
    )
}

function ChartOption({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="flex items-start gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="mt-0.5">{icon}</div>
            <div>
                <h4 className="font-medium">{title}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </div>
    )
}

function Badge({ type, label }: { type: string; label: string }) {
    const colorMap = {
        animal: "bg-primary/10 text-primary border-primary/20",
        status: "bg-status-green/10 text-status-green border-status-green/20",
        experiment: "bg-status-purple/10 text-status-purple border-status-purple/20",
    }

    return (
        <div className={`text-xs px-2 py-1 rounded-full border ${colorMap[type as keyof typeof colorMap]}`}>
            {label}
            <button className="ml-1 text-gray-500 hover:text-gray-700">×</button>
        </div>
    )
}
