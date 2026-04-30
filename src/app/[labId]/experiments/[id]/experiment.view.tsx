"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/components/ui/dropdown-menu"
import { ArrowLeft, ChevronDown, Download, Edit, FileText, Share } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { ExperimentOverviewTab } from "./tabs/experiment-overview-tab"
import { ExperimentAnimalsTab } from "./tabs/experiment-animals-tab"
import { ExperimentMetricsTab } from "./tabs/experiment-metrics-tab"
import { ExperimentTasksTab } from "./tabs/experiment-tasks-tab"
import { StatusBadge } from "@/src/components/status-badge"
import type { InitialMembersTypes } from "../../team/types"
import { Button } from "@/src/components/ui/button"
import type { Role } from "@/src/app/account/types"
import type { Animal } from "../../animals/types"
import type { Experiment } from "../types"
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
  experiment: Experiment
  memberSearch: string
  animalSearch: string
  userId: string
  labId: string
}

export const ExperimentView = (props: ExperimentViewProps) => {
  const {
    experiment,
    labId,
    userId,
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

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="animals">Animals</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <ExperimentOverviewTab
          experiment={experiment}
          userId={userId}
          canManageMembers={canManageMembers}
          creatorLabRole={creatorLabRole}
          addMembersOpen={addMembersOpen}
          onAddMembersOpenChange={onAddMembersOpenChange}
          memberSearch={memberSearch}
          onMemberSearchChange={onMemberSearchChange}
          addCandidates={addCandidates}
          onAddMember={onAddMember}
          onRemoveMember={onRemoveMember}
        />

        <ExperimentAnimalsTab
          experiment={experiment}
          labId={labId}
          canManageMembers={canManageMembers}
          addAnimalsOpen={addAnimalsOpen}
          onAddAnimalsOpenChange={onAddAnimalsOpenChange}
          animalSearch={animalSearch}
          onAnimalSearchChange={onAnimalSearchChange}
          animalAddCandidates={animalAddCandidates}
          onAddAnimal={onAddAnimal}
          onRemoveAnimal={onRemoveAnimal}
        />

        <ExperimentMetricsTab />

        <ExperimentTasksTab experiment={experiment} />
      </Tabs>
    </div>
  )
}
