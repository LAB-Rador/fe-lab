"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { ArrowLeft, Archive, ArchiveRestore, ChevronDown, Download, Edit, FileText, Share } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ExperimentOverviewTab } from "./tabs/experiment-overview-tab"
import { ExperimentAnimalsTab } from "./tabs/experiment-animals-tab"
import { ExperimentMetricsTab } from "./tabs/experiment-metrics-tab"
import type { Experiment, ExperimentAnimalRecordRow, ExperimentMetricsData } from "../types"
import { ExperimentTasksTab } from "./tabs/experiment-tasks-tab"
import { StatusBadge } from "@/src/components/status-badge"
import type { InitialMembersTypes } from "../../team/types"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import type { Role } from "@/src/app/account/types"
import type { Animal } from "../../animals/types"
import Link from "next/link"

interface ExperimentViewProps {
  onRemoveMember: (targetUserId: string) => void | Promise<void>
  onAddMember: (targetUserId: string) => void | Promise<void>
  onRemoveAnimal: (animalId: string) => void | Promise<void>
  onAddAnimal: (animalId: string) => void | Promise<void>
  onAddMembersOpenChange: (open: boolean) => void
  onAddAnimalsOpenChange: (open: boolean) => void
  onMemberSearchChange: (value: string) => void
  onAnimalSearchChange: (value: string) => void
  addCandidates: InitialMembersTypes[]
  labMembers: InitialMembersTypes[]
  creatorLabRole: Role | undefined
  animalAddCandidates: Animal[]
  canManageMembers: boolean
  addMembersOpen: boolean
  addAnimalsOpen: boolean
  animalRecords: ExperimentAnimalRecordRow[]
  experiment: Experiment
  metrics: ExperimentMetricsData | null
  memberSearch: string
  animalSearch: string
  userId: string
  labId: string
  onArchiveExperiment: () => void | Promise<void>
  onUnarchiveExperiment: () => void | Promise<void>
}

export const ExperimentView = (props: ExperimentViewProps) => {
  const {
    animalRecords,
    experiment,
    labId,
    userId,
    metrics,
    labMembers,
    canManageMembers,
    creatorLabRole,
    addMembersOpen,
    onAddMembersOpenChange,
    memberSearch,
    onMemberSearchChange,
    addCandidates,
    addAnimalsOpen,
    onAddAnimalsOpenChange,
    animalSearch,
    onAnimalSearchChange,
    animalAddCandidates,
    onAddMember,
    onRemoveMember,
    onAddAnimal,
    onRemoveAnimal,
    onArchiveExperiment,
    onUnarchiveExperiment,
  } = props

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
            <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
              <span>ID: {experiment?.id}</span>
              <span>•</span>
              <StatusBadge status={experiment?.status as any} />
              {experiment?.archivedAt ? (
                <Badge variant="secondary" className="text-xs">
                  Archived
                </Badge>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canManageMembers ? (
            experiment?.archivedAt ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => void onUnarchiveExperiment()}
              >
                <ArchiveRestore className="mr-2 h-4 w-4" />
                Unarchive
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => void onArchiveExperiment()}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
            )
          ) : null}
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="animals">Animals</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <ExperimentOverviewTab
          animalRecords={animalRecords}
          onAddMembersOpenChange={onAddMembersOpenChange}
          onMemberSearchChange={onMemberSearchChange}
          canManageMembers={canManageMembers}
          onRemoveMember={onRemoveMember}
          creatorLabRole={creatorLabRole}
          addMembersOpen={addMembersOpen}
          addCandidates={addCandidates}
          memberSearch={memberSearch}
          onAddMember={onAddMember}
          experiment={experiment}
          labId={labId}
          userId={userId}
        />

        <ExperimentAnimalsTab
          onAddAnimalsOpenChange={onAddAnimalsOpenChange}
          onAnimalSearchChange={onAnimalSearchChange}
          animalAddCandidates={animalAddCandidates}
          canManageMembers={canManageMembers}
          addAnimalsOpen={addAnimalsOpen}
          onRemoveAnimal={onRemoveAnimal}
          animalSearch={animalSearch}
          onAddAnimal={onAddAnimal}
          experiment={experiment}
          labId={labId}
        />

        <ExperimentMetricsTab metrics={metrics} />

        <ExperimentTasksTab experiment={experiment} />
      </Tabs>
    </div>
  )
}
