"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { Beaker, Calendar, ChevronDown, Filter, MousePointer, Plus, Search, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Card, CardContent, CardFooter } from "@/src/components/ui/card"
import { StatusBadge } from "@/src/components/status-badge"
import { Checkbox } from "@/src/components/ui/checkbox"
import type { Dispatch, SetStateAction } from "react"
import { calculateProgress } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Badge } from "@/src/components/ui/badge"
import { Input } from "@/src/components/ui/input"
import type { Experiment } from "./types"
import Link from "next/link"

interface ExperimentsViewProps {
    setStatusFilter: Dispatch<SetStateAction<string>>;
    onIncludeArchivedChange: (value: boolean) => void;
    setSearchQuery: Dispatch<SetStateAction<string>>;
    setDateFilter: Dispatch<SetStateAction<string>>;
    filteredExperiments: Experiment[];
    setOpen: (open: boolean) => void;
    includeArchived: boolean;
    statusFilter: string;
    searchQuery: string;
    dateFilter: string;
    labId: string;
}

export default function ExperimentsView(props: ExperimentsViewProps) {
    const { filteredExperiments, setStatusFilter, setSearchQuery, setDateFilter, setOpen, statusFilter, searchQuery, dateFilter, labId, includeArchived, onIncludeArchivedChange } = props;

    const linkedAnimalCount = (experiment: Experiment) =>
      experiment.animalCount ?? (experiment.animals?.length ?? 0)

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Experiments</h1>
            <p className="text-gray-500">Manage and monitor your laboratory experiments</p>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
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
              <SelectTrigger className="sm:w-[140px] [display: contents]">
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
              <SelectTrigger className="sm:w-[140px] [display: contents]">
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

            <div className="flex items-center space-x-2 sm:items-center">
              <Checkbox
                id="include-archived-experiments"
                checked={includeArchived}
                onCheckedChange={(c) => onIncludeArchivedChange(Boolean(c))}
              />
              <Label htmlFor="include-archived-experiments" className="text-sm font-normal whitespace-nowrap">
                Include archived
              </Label>
            </div>
          </div>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExperiments.map((experiment: Experiment) => (
            <Link href={`/${labId}/experiments/${experiment.id}`} key={experiment.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Beaker className="h-5 w-5 text-blue-600" />
                      <StatusBadge status={experiment.status as any} />
                      {experiment.archivedAt ? (
                        <Badge variant="secondary" className="text-xs">
                          Archived
                        </Badge>
                      ) : null}
                    </div>
                    <div className="text-sm text-gray-500">Dates: {experiment.startDate ? new Date(experiment.startDate).toLocaleDateString() : 'N/A'} - {experiment.endDate ? new Date(experiment.endDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{experiment.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{experiment.description}</p>
  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-medium">{calculateProgress(experiment.startDate, experiment.endDate)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${calculateProgress(experiment.startDate, experiment.endDate)}%` }}></div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-500 flex flex-wrap gap-3 justify-between items-center">
                  <div className="inline-flex items-center gap-1.5 font-medium text-gray-700">
                    <MousePointer className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                    <span>
                      Animals: <span className="tabular-nums">{linkedAnimalCount(experiment)}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0 justify-end">
                    <span className="truncate">{experiment.createdBy?.firstName} {experiment.createdBy?.lastName}</span>
                    <span className="truncate">{experiment.createdBy?.email ? `· ${experiment.createdBy.email}` : ''}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    )
}