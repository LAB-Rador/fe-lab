import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Calendar, Download, ExternalLink, Filter, Search, Users } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Input } from "@/src/components/ui/input"
import Link from "next/link"
import type { AnimalExperimentParticipation } from "@/src/app/[labId]/animals/[id]/types"

interface AnimalExperimentsProps {
  labId: string
  experiments: AnimalExperimentParticipation[]
}

export function AnimalExperiments({ labId, experiments }: AnimalExperimentsProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Search experiments..." className="w-full pl-8" />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
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
              ) : (
                experiments.map((row) => {
                  const exp = row.experiment
                  const pi = [exp.createdBy?.firstName, exp.createdBy?.lastName].filter(Boolean).join(" ").trim()
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

      <Card>
        <CardHeader>
          <CardTitle>Experiment Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Procedure scheduling for experiments will appear here when available.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

interface ExperimentStatusBadgeProps {
  status: string
}

function ExperimentStatusBadge({ status }: ExperimentStatusBadgeProps) {
  const getStatusColor = (s: string) => {
    switch (s.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "PLANNED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case "PAUSED":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100"
      case "COMPLETED":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      case "CANCELLED":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      default:
        switch (s.toLowerCase()) {
          case "active":
            return "bg-green-100 text-green-800 hover:bg-green-100"
          case "scheduled":
            return "bg-blue-100 text-blue-800 hover:bg-blue-100"
          case "completed":
            return "bg-gray-100 text-gray-800 hover:bg-gray-100"
          case "cancelled":
            return "bg-red-100 text-red-800 hover:bg-red-100"
          default:
            return "bg-gray-100 text-gray-800 hover:bg-gray-100"
        }
    }
  }

  const label = status ? status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, " ") : status

  return (
    <Badge variant="outline" className={`${getStatusColor(status)}`}>
      {label}
    </Badge>
  )
}
