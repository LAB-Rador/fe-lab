"use client"

import { ArrowLeft, Calendar, Check, ChevronDown, Clock, Download, Edit, FileText, MousePointer, Plus, Share } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/src/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { StatusBadge } from "@/src/components/status-badge"
import { Progress } from "@/src/components/ui/progress"
import { Button } from "@/src/components/ui/button"
import { Experiment } from "../types"
import { useState } from "react"
import Link from "next/link"
import { TaskStatus } from "../../tasks/types"

interface ExperimentViewProps {
  calculateProgress: (startDate?: string, endDate?: string) => number;
  experiment: Experiment;
  experimentId: string;
  labId: string;
}

export const ExperimentView = (props: ExperimentViewProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview")
  const { experiment, calculateProgress, experimentId, labId } = props;


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${labId}/experiments`}>
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to experiments</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{experiment?.title}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>ID: {experiment?.id}</span>
              <span>•</span>
              <StatusBadge status={experiment?.status as any} />
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
                <CardTitle>{experiment?.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">{experiment?.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Protocol</div>
                      <div className="font-medium">{experiment?.protocol}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="font-medium">
                        <StatusBadge status={experiment?.status as any} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Start Date</div>
                      <div className="font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        {new Date(experiment?.startDate || '').toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">End Date</div>
                      <div className="font-medium flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                        {new Date(experiment?.endDate || '').toLocaleDateString()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Created By</div>
                      <div className="font-medium">{experiment?.createdBy?.firstName} {experiment?.createdBy?.lastName}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-500">Progress</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{calculateProgress(experiment?.startDate, experiment?.endDate)}%</span>
                          <span className="text-gray-500">
                            <Clock className="inline-block mr-1 h-3 w-3" />
                            {Math.floor((new Date(experiment?.endDate || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                          </span>
                        </div>
                        <Progress value={calculateProgress(experiment?.startDate, experiment?.endDate)} className="h-2" />
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
                  {experiment?.createdBy?.firstName} {experiment?.createdBy?.lastName}
                  
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
                    <TableRow>
                      <TableCell className="font-medium">Parameter</TableCell>
                      <TableCell>Control Group</TableCell>
                      <TableCell>Experimental Group</TableCell>
                      <TableCell>Difference</TableCell>
                      <TableCell>Statistical Significance</TableCell>
                    </TableRow>
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
            {experiment?.animals?.map((animal) => (
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
                      <div>{animal.animalType.name}</div>
                      <div className="text-gray-500">Strain</div>
                      <div>{animal.strain}</div>
                      <div className="text-gray-500">Age</div>
                      <div>{animal.sex || "-"}</div>
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
                    <LineChart data={[]}>
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
                  {experiment?.tasks?.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.title}</TableCell>
                      <TableCell>{task.assignedTo?.firstName} {task.assignedTo?.lastName}</TableCell>
                      <TableCell>{task.dueDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {task.status === TaskStatus.COMPLETED && <Check className="h-4 w-4 text-green-500" />}
                          <span
                            className={
                              task.status === TaskStatus.COMPLETED
                                ? "text-green-600"
                                : task.status === TaskStatus.IN_PROGRESS
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