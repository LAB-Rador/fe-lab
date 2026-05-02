"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import type { Experiment, ExperimentAnimalRecordRow } from "../../types"
import { Calendar, Clock, Plus, Search, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar"
import { calculateProgress, getInitials } from "@/src/lib/utils"
import type { InitialMembersTypes } from "../../../team/types"
import { StatusBadge } from "@/src/components/status-badge"
import { Progress } from "@/src/components/ui/progress"
import { TabsContent } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import type { Role } from "@/src/app/account/types"
import { Input } from "@/src/components/ui/input"
import Link from "next/link"

function humanizeRecordEnum(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ")
}

function measurementsJoined(rows: ExperimentAnimalRecordRow["measurements"]) {
  if (!rows?.length) return ""
  return rows.map((m) => `${m.parameter}: ${m.value}${m.unit ? ` ${m.unit}` : ""}`).join(", ")
}

function formatMeasurementsSummary(rows: ExperimentAnimalRecordRow["measurements"]) {
  const full = measurementsJoined(rows)
  if (!full) return "—"
  return full.length > 96 ? `${full.slice(0, 93)}…` : full
}

export interface ExperimentOverviewTabProps {
  animalRecords: ExperimentAnimalRecordRow[]
  experiment: Experiment
  labId: string
  userId: string
  canManageMembers: boolean
  creatorLabRole: Role | undefined
  addMembersOpen: boolean
  onAddMembersOpenChange: (open: boolean) => void
  memberSearch: string
  onMemberSearchChange: (value: string) => void
  addCandidates: InitialMembersTypes[]
  onAddMember: (targetUserId: string) => void | Promise<void>
  onRemoveMember: (targetUserId: string) => void | Promise<void>
}

export function ExperimentOverviewTab(props: ExperimentOverviewTabProps) {
  const {
    animalRecords,
    experiment,
    labId,
    userId,
    canManageMembers,
    creatorLabRole,
    addMembersOpen,
    onAddMembersOpenChange,
    memberSearch,
    onMemberSearchChange,
    addCandidates,
    onAddMember,
    onRemoveMember,
  } = props

  return (
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
                        {!experiment?.endDate ? 'N/A' : Math.floor((new Date(experiment?.endDate || '').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
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
          <CardContent className="space-y-4">
            {experiment?.createdBy && (
              <div className="flex items-center justify-between gap-2 rounded-md border border-gray-100 bg-gray-50/50 p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="bg-blue-600 text-sm font-semibold text-white">
                      {getInitials(
                        experiment.createdBy.firstName ?? "",
                        experiment.createdBy.lastName ?? "",
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <div className="truncate font-medium">
                      {experiment.createdBy.firstName} {experiment.createdBy.lastName}
                    </div>
                    <div className="truncate text-sm text-gray-600">
                      {creatorLabRole ? `${creatorLabRole} · ` : ""}
                      Creator
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(experiment.members ?? []).map((m) => {
              const labRole = m.user.laboratories[0]?.role
              const showRemove = canManageMembers || m.userId === userId
              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-gray-100 p-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-slate-600 text-sm font-semibold text-white">
                        {getInitials(m.user.firstName ?? "", m.user.lastName ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-medium">
                        {m.user.firstName} {m.user.lastName}
                      </div>
                      <div className="truncate text-sm text-gray-600">
                        {labRole ?? "Member"}
                      </div>
                    </div>
                  </div>
                  {showRemove && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onRemoveMember(m.userId)}
                      aria-label="Remove member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )
            })}

            {canManageMembers && (
              <Dialog open={addMembersOpen} onOpenChange={onAddMembersOpenChange}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Team Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Laboratory members</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-500">
                    Add people who already belong to this lab. They will see this experiment on the Experiments page.
                  </p>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Search by name or email..."
                      className="pl-9"
                      value={memberSearch}
                      onChange={(e) => onMemberSearchChange(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[280px] space-y-2 overflow-y-auto">
                    {addCandidates.length === 0 ? (
                      <p className="py-6 text-center text-sm text-gray-500">No members available to add</p>
                    ) : (
                      addCandidates.map((lm) => (
                        <div
                          key={lm.id}
                          className="flex items-center justify-between gap-2 rounded-md border border-gray-100 p-3"
                        >
                          <div className="min-w-0">
                            <div className="truncate font-medium">
                              {lm.user.firstName} {lm.user.lastName}
                            </div>
                            <div className="truncate text-sm text-gray-600">{lm.role}</div>
                            <div className="truncate text-xs text-gray-400">{lm.user.email}</div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            className="shrink-0 bg-blue-600 hover:bg-blue-700"
                            onClick={() => void onAddMember(lm.userId)}
                          >
                            Add
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
          <CardDescription>
            Animal records logged with this experiment (latest 200, newest first).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border border-gray-100">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                  <TableHead className="whitespace-nowrap">Date</TableHead>
                  <TableHead>Animal</TableHead>
                  <TableHead className="whitespace-nowrap">Type</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Temp. (°C)</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Weight</TableHead>
                  <TableHead className="whitespace-nowrap">Activity</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Feed</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Water</TableHead>
                  <TableHead className="min-w-[140px]">Parameters</TableHead>
                  <TableHead className="min-w-[160px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {animalRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-sm text-gray-500">
                      No animal records for this experiment yet. Link animals and add measurements with experiment
                      context.
                    </TableCell>
                  </TableRow>
                ) : (
                  animalRecords.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="whitespace-nowrap align-top text-sm tabular-nums text-gray-700">
                        {new Date(row.date).toLocaleString()}
                      </TableCell>
                      <TableCell className="align-top">
                        <Link
                          href={`/${labId}/animals/${row.animal.id}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {row.animal.name || row.animal.identifier}
                        </Link>
                        <div className="text-xs text-gray-400">{row.animal.identifier}</div>
                      </TableCell>
                      <TableCell className="align-top text-sm whitespace-nowrap">
                        {humanizeRecordEnum(row.recordType)}
                      </TableCell>
                      <TableCell className="align-top text-right text-sm tabular-nums">
                        {row.temperature != null ? row.temperature.toFixed(1) : "—"}
                      </TableCell>
                      <TableCell className="align-top text-right text-sm tabular-nums">
                        {row.weight != null ? row.weight.toFixed(2) : "—"}
                      </TableCell>
                      <TableCell className="align-top text-sm whitespace-nowrap">
                        {row.activityLevel ? humanizeRecordEnum(row.activityLevel) : "—"}
                      </TableCell>
                      <TableCell className="align-top text-right text-sm tabular-nums">
                        {row.feedIntake != null ? row.feedIntake.toFixed(1) : "—"}
                      </TableCell>
                      <TableCell className="align-top text-right text-sm tabular-nums">
                        {row.waterIntake != null ? row.waterIntake.toFixed(1) : "—"}
                      </TableCell>
                      <TableCell
                        className="align-top max-w-[220px] text-xs text-gray-700"
                        title={measurementsJoined(row.measurements) || undefined}
                      >
                        {formatMeasurementsSummary(row.measurements)}
                      </TableCell>
                      <TableCell className="align-top max-w-[220px] text-sm text-gray-600">
                        {row.notes ? (
                          <span className="line-clamp-2" title={row.notes}>
                            {row.notes}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}
