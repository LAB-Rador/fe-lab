"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Beaker, Calendar, ChevronDown, Filter, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { StatusBadge } from "@/src/components/status-badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { useParams } from "next/navigation"
import { useState } from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"

// Mock data for experiments
const experiments = [
  {
    id: "exp-001",
    title: "Behavioral Response to Environmental Stimuli",
    description: "Testing mice response to various environmental changes",
    status: "active",
    startDate: "2023-10-15",
    endDate: "2023-12-30",
    progress: 65,
    animalCount: 24,
    lead: "Dr. Emily Chen",
  },
  {
    id: "exp-002",
    title: "Neurological Impact of Diet Modification",
    description: "Studying the effects of dietary changes on neural activity in lab mice",
    status: "active",
    startDate: "2023-09-01",
    endDate: "2024-03-15",
    progress: 42,
    animalCount: 36,
    lead: "Dr. Michael Rodriguez",
  },
  {
    id: "exp-003",
    title: "Genetic Expression in Avian Species",
    description: "Analyzing genetic markers in response to controlled stimuli",
    status: "pending",
    startDate: "2023-11-20",
    endDate: "2024-05-10",
    progress: 0,
    animalCount: 15,
    lead: "Dr. Sarah Johnson",
  },
  {
    id: "exp-004",
    title: "Aquatic Toxicity Assessment",
    description: "Evaluating the impact of chemical compounds on zebrafish development",
    status: "completed",
    startDate: "2023-06-10",
    endDate: "2023-09-30",
    progress: 100,
    animalCount: 50,
    lead: "Dr. James Wilson",
  },
  {
    id: "exp-005",
    title: "Stress Response in Rodent Models",
    description: "Measuring physiological responses to various stressors",
    status: "critical",
    startDate: "2023-08-05",
    endDate: "2024-02-28",
    progress: 35,
    animalCount: 30,
    lead: "Dr. Lisa Thompson",
  },
  {
    id: "exp-006",
    title: "Circadian Rhythm Disruption Study",
    description: "Investigating the effects of light cycle changes on laboratory mice",
    status: "cancelled",
    startDate: "2023-07-12",
    endDate: "2023-10-15",
    progress: 45,
    animalCount: 28,
    lead: "Dr. Robert Kim",
  },
]

export default function ExperimentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const params = useParams();
  const { userId, labId } = params;
  
  // Filter experiments based on search query and filters
  const filteredExperiments = experiments.filter((experiment) => {
    // Search filter
    const matchesSearch =
      experiment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      experiment.lead.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || experiment.status === statusFilter

    // Date filter (simplified for demo)
    const matchesDate = dateFilter === "all" // In a real app, implement proper date filtering

    return matchesSearch && matchesStatus && matchesDate
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Experiments</h1>
          <p className="text-gray-500">Manage and monitor your laboratory experiments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          New Experiment
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search experiments..."
            className="pl-9 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-1">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">More Filters</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>Lead Researcher</DropdownMenuItem>
                <DropdownMenuItem>Animal Type</DropdownMenuItem>
                <DropdownMenuItem>Department</DropdownMenuItem>
                <DropdownMenuItem>Funding Source</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExperiments.map((experiment) => (
          <Link href={`/${userId}/${labId}/experiments/${experiment.id}`} key={experiment.id}>
            <Card className="h-full hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <Beaker className="h-5 w-5 text-blue-600" />
                    <StatusBadge status={experiment.status as any} />
                  </div>
                  <div className="text-sm text-gray-500">ID: {experiment.id}</div>
                </div>
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{experiment.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{experiment.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium">{experiment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${experiment.progress}%` }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 flex justify-between">
                <div>Animals: {experiment.animalCount}</div>
                <div>{experiment.lead}</div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
