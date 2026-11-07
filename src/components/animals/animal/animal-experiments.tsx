"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Calendar, Download, ExternalLink, Search, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Input } from "@/src/components/ui/input"
import { useMemo, useState } from "react"
import Link from "next/link"
import type { AnimalExperimentParticipation } from "@/src/app/[labId]/animals/[id]/types"

const EXPERIMENT_STATUSES = ["PLANNED", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"] as const

interface AnimalExperimentsProps {
  labId: string
  experiments: AnimalExperimentParticipation[]
}

function investigatorName(experiment: AnimalExperimentParticipation["experiment"]) {
  return [experiment.createdBy?.firstName, experiment.createdBy?.lastName].filter(Boolean).join(" ").trim()
}

function statusLabel(status: string) {
  return status ? status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ") : status
}

function csvCell(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function AnimalExperiments({ labId, experiments }: AnimalExperimentsProps) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const visible = useMemo(() => {
    const query = search.trim().toLowerCase()
    return experiments.filter((row) => {
      const experiment = row.experiment
      if (status !== "all" && experiment.status !== status) return false
      if (!query) return true
      const haystack = [experiment.title, experiment.id, experiment.status, investigatorName(experiment)].join(" ").toLowerCase()
      return haystack.includes(query)
    })
  }, [experiments, search, status])

  const exportCsv = () => {
    const header = ["ID", "Title", "Status", "Start", "End", "Principal Investigator"]
    const lines = visible.map((row) => {
      const experiment = row.experiment
      const start = experiment.startDate ? new Date(experiment.startDate).toLocaleDateString() : ""
      const end = experiment.endDate ? new Date(experiment.endDate).toLocaleDateString() : ""
      return [experiment.id, experiment.title, statusLabel(experiment.status), start, end, investigatorName(experiment)]
        .map(csvCell)
        .join(",")
    })
    const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "experiment-participation.csv"
    anchor.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search experiments..."
            className="w-full pl-8"
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {EXPERIMENT_STATUSES.map((item) => (
                <SelectItem key={item} value={item}>{statusLabel(item)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="button" variant="outline" size="sm" className="flex items-center gap-2" disabled={visible.length === 0} onClick={exportCsv}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Experiment Participation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Principal Investigator</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {experiments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-gray-500 py-10">
                    This animal is not linked to any experiment yet.
                  </TableCell>
                </TableRow>
              ) : visible.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-gray-500 py-10">
                    No experiments match this search.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((row) => {
                  const exp = row.experiment
                  const pi = investigatorName(exp)
                  const start = exp.startDate ? new Date(exp.startDate).toLocaleDateString() : "—"
                  const end = exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "—"
                  return (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium max-w-[120px] truncate" title={exp.id}>
                        {exp.id}
                      </TableCell>
                      <TableCell>{exp.title}</TableCell>
                      <TableCell>
                        <ExperimentStatusBadge status={exp.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          <span className="text-sm">
                            {start} – {end}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          <span className="text-sm">{pi || "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
                          <Link href={`/${labId}/experiments/${exp.id}`}>
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

interface ExperimentStatusBadgeProps {
  status: string
}

function ExperimentStatusBadge({ status }: ExperimentStatusBadgeProps) {
  const color: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 hover:bg-green-100",
    PLANNED: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    PAUSED: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    COMPLETED: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    CANCELLED: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return (
    <Badge variant="outline" className={color[status.toUpperCase()] ?? "bg-gray-100 text-gray-800 hover:bg-gray-100"}>
      {statusLabel(status)}
    </Badge>
  )
}
