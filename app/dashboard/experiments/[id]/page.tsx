"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Download,
  Edit,
  FileText,
  MousePointer,
  Plus,
  Share,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for experiment details
const experimentData = {
  id: "exp-001",
  title: "Behavioral Response to Environmental Stimuli",
  description:
    "This experiment aims to test how laboratory mice respond to various environmental changes including temperature, light intensity, and noise levels. The study will help understand stress responses and adaptation mechanisms in controlled environments.",
  status: "active",
  startDate: "2023-10-15",
  endDate: "2023-12-30",
  progress: 65,
  department: "Neurobiology",
  location: "Lab B, Room 305",
  lead: "Dr. Emily Chen",
  team: [
    { id: "user-1", name: "Dr. Emily Chen", role: "Lead Researcher", avatar: "/placeholder.svg?height=40&width=40" },
    {
      id: "user-2",
      name: "Dr. Michael Wong",
      role: "Research Associate",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    { id: "user-3", name: "Sarah Johnson", role: "Lab Technician", avatar: "/placeholder.svg?height=40&width=40" },
    { id: "user-4", name: "Robert Davis", role: "Graduate Assistant", avatar: "/placeholder.svg?height=40&width=40" },
  ],
  animals: [
    { id: "animal-001", name: "M-001", species: "Mouse", strain: "C57BL/6", age: "10 weeks", status: "active" },
    { id: "animal-002", name: "M-002", species: "Mouse", strain: "C57BL/6", age: "10 weeks", status: "active" },
    { id: "animal-003", name: "M-003", species: "Mouse", strain: "C57BL/6", age: "11 weeks", status: "critical" },
    { id: "animal-004", name: "M-004", species: "Mouse", strain: "BALB/c", age: "9 weeks", status: "active" },
    { id: "animal-005", name: "M-005", species: "Mouse", strain: "BALB/c", age: "9 weeks", status: "completed" },
    { id: "animal-006", name: "M-006", species: "Mouse", strain: "BALB/c", age: "9 weeks", status: "active" },
  ],
  tasks: [
    {
      id: "task-001",
      title: "Initial baseline measurements",
      status: "completed",
      assignee: "Sarah Johnson",
      dueDate: "2023-10-20",
    },
    {
      id: "task-002",
      title: "Temperature variation test",
      status: "completed",
      assignee: "Dr. Michael Wong",
      dueDate: "2023-11-05",
    },
    {
      id: "task-003",
      title: "Light intensity experiment",
      status: "active",
      assignee: "Robert Davis",
      dueDate: "2023-11-25",
    },
    {
      id: "task-004",
      title: "Noise level response test",
      status: "pending",
      assignee: "Dr. Emily Chen",
      dueDate: "2023-12-10",
    },
    {
      id: "task-005",
      title: "Data analysis and reporting",
      status: "pending",
      assignee: "Dr. Emily Chen",
      dueDate: "2023-12-25",
    },
  ],
  metrics: [
    { day: "1", temperature: 20, activity: 45, stress: 30 },
    { day: "5", temperature: 22, activity: 40, stress: 35 },
    { day: "10", temperature: 24, activity: 30, stress: 45 },
    { day: "15", temperature: 26, activity: 25, stress: 60 },
    { day: "20", temperature: 28, activity: 20, stress: 70 },
    { day: "25", temperature: 26, activity: 30, stress: 50 },
    { day: "30", temperature: 24, activity: 40, stress: 40 },
    { day: "35", temperature: 22, activity: 50, stress: 30 },
  ],
  results: [
    {
      parameter: "Baseline Activity",
      control: "45 movements/hr",
      experimental: "45 movements/hr",
      difference: "0%",
      significance: "N/A",
    },
    {
      parameter: "High Temp Activity",
      control: "40 movements/hr",
      experimental: "25 movements/hr",
      difference: "-37.5%",
      significance: "p<0.01",
    },
    {
      parameter: "Low Light Activity",
      control: "42 movements/hr",
      experimental: "38 movements/hr",
      difference: "-9.5%",
      significance: "p<0.05",
    },
    {
      parameter: "High Noise Activity",
      control: "44 movements/hr",
      experimental: "20 movements/hr",
      difference: "-54.5%",
      significance: "p<0.001",
    },
    {
      parameter: "Cortisol Levels",
      control: "12 ng/ml",
      experimental: "28 ng/ml",
      difference: "+133%",
      significance: "p<0.001",
    },
  ],
}

export default function ExperimentDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")

  // In a real app, you would fetch the experiment data based on the ID
  const experiment = experimentData

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/experiments">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to experiments</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{experiment.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>ID: {experiment.id}</span>
              <span>•</span>
              <StatusBadge status={experiment.status as any} />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <span>Actions</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="animals">Animals</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Experiment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">{experiment.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Department</div>
                      <div className="font-medium">{experiment.department}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium">{experiment.location}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Start Date</div>
                      <div className="font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        {experiment.startDate}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">End Date</div>
                      <div className="font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        {experiment.endDate}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Lead Researcher</div>
                      <div className="font-medium">{experiment.lead}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Progress</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{experiment.progress}%</span>
                          <span className="text-gray-500">
                            <Clock className="inline-block mr-1 h-3 w-3" />
                            45 days remaining
                          </span>
                        </div>
                        <Progress value={experiment.progress} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiment.team.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.role}</div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Control Group</TableHead>
                      <TableHead>Experimental Group</TableHead>
                      <TableHead>Difference</TableHead>
                      <TableHead>Statistical Significance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experiment.results.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{result.parameter}</TableCell>
                        <TableCell>{result.control}</TableCell>
                        <TableCell>{result.experimental}</TableCell>
                        <TableCell>{result.difference}</TableCell>
                        <TableCell>{result.significance}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="animals" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Experiment Animals</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Animal
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {experiment.animals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <MousePointer className="h-5 w-5 text-blue-600" />
                        <StatusBadge status={animal.status as any} />
                      </div>
                      <div className="text-sm text-gray-500">ID: {animal.id}</div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{animal.name}</h3>
                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                      <div className="text-gray-500">Species</div>
                      <div>{animal.species}</div>
                      <div className="text-gray-500">Strain</div>
                      <div>{animal.strain}</div>
                      <div className="text-gray-500">Age</div>
                      <div>{animal.age}</div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm">
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Experiment Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ChartContainer
                  config={{
                    temperature: {
                      label: "Temperature (°C)",
                      color: "hsl(var(--chart-1))",
                    },
                    activity: {
                      label: "Activity Level",
                      color: "hsl(var(--chart-2))",
                    },
                    stress: {
                      label: "Stress Indicators",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={experiment.metrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" label={{ value: "Day", position: "insideBottomRight", offset: -5 }} />
                      <YAxis label={{ value: "Value", angle: -90, position: "insideLeft" }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="var(--color-temperature)"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="activity" stroke="var(--color-activity)" />
                      <Line type="monotone" dataKey="stress" stroke="var(--color-stress)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Temperature</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">24.5°C</div>
                <p className="text-sm text-gray-500">+2.5°C from baseline</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">35</div>
                <p className="text-sm text-gray-500">-10 from baseline</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Stress Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">45</div>
                <p className="text-sm text-gray-500">+15 from baseline</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Experiment Tasks</h2>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Task</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {experiment.tasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.assignee}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {task.status === "completed" && <Check className="h-4 w-4 text-green-500" />}
                          <span
                            className={
                              task.status === "completed"
                                ? "text-green-600"
                                : task.status === "active"
                                  ? "text-blue-600"
                                  : "text-gray-500"
                            }
                          >
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
