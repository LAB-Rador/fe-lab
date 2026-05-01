"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { MousePointer, Plus, Search, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/src/components/ui/card"
import { Badge } from "@/src/components/ui/badge"
import { StatusBadge } from "@/src/components/status-badge"
import { TabsContent } from "@/src/components/ui/tabs"
import type { Animal } from "../../../animals/types"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import type { Experiment } from "../../types"
import Link from "next/link"

export interface ExperimentAnimalsTabProps {
  onRemoveAnimal: (animalId: string) => void | Promise<void>
  onAddAnimal: (animalId: string) => void | Promise<void>
  onAddAnimalsOpenChange: (open: boolean) => void
  onAnimalSearchChange: (value: string) => void
  animalAddCandidates: Animal[]
  canManageMembers: boolean
  addAnimalsOpen: boolean
  experiment: Experiment
  animalSearch: string
  labId: string
}

export function ExperimentAnimalsTab(props: ExperimentAnimalsTabProps) {
  const {
    experiment,
    labId,
    canManageMembers,
    addAnimalsOpen,
    onAddAnimalsOpenChange,
    animalSearch,
    onAnimalSearchChange,
    animalAddCandidates,
    onAddAnimal,
    onRemoveAnimal,
  } = props

  return (
    <TabsContent value="animals" className="space-y-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Experiment Animals</h2>
        {canManageMembers && (
          <Dialog open={addAnimalsOpen} onOpenChange={onAddAnimalsOpenChange}>
            <DialogTrigger asChild>
              <Button type="button">
                <Plus className="mr-2 h-4 w-4" />
                Add Animal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Animals in this laboratory</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-gray-500">
                Choose animals from your lab inventory. They will be linked to this experiment via ExperimentAnimal.
              </p>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search by name, ID, species, strain..."
                  className="pl-9"
                  value={animalSearch}
                  onChange={(e) => onAnimalSearchChange(e.target.value)}
                />
              </div>
              <div className="max-h-[280px] space-y-2 overflow-y-auto">
                {animalAddCandidates.length === 0 ? (
                  <p className="py-6 text-center text-sm text-gray-500">No animals available to add</p>
                ) : (
                  animalAddCandidates.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between gap-2 rounded-md border border-gray-100 p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-medium">{a.name || a.identifier}</div>
                        <div className="truncate text-sm text-gray-600">{a.animalType?.name}</div>
                        <div className="truncate text-xs text-gray-400">{a.identifier}</div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        className="shrink-0 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          if (a.id) void onAddAnimal(a.id)
                        }}
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(experiment.animals ?? []).length === 0 ? (
          <p className="col-span-full text-center text-sm text-gray-500 py-8">
            No animals linked yet. Use Add Animal to attach animals from the lab.
          </p>
        ) : (
          (experiment.animals ?? []).map((animal) => (
            <Card
              key={animal.id}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-0">
                <div className="border-b border-gray-100 bg-gradient-to-b from-slate-50/90 to-white px-5 py-4">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-100 bg-blue-50">
                      <MousePointer className="h-5 w-5 text-blue-600" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-semibold tracking-tight text-gray-900">
                        {animal.name || animal.identifier}
                      </h3>
                      <p
                        className="mt-1 truncate font-mono text-[11px] leading-snug text-gray-400"
                        title={animal.id}
                      >
                        {animal.id}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <StatusBadge status={animal.status as any} />
                        {animal.archivedAt ? (
                          <Badge
                            variant="outline"
                            className="border-violet-400 bg-violet-100 text-xs font-medium text-violet-900 hover:bg-violet-100"
                          >
                            ARCHIVED
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 px-5 py-4">
                  {(
                    [
                      { label: "Species", value: animal.animalType?.name ?? "—" },
                      { label: "Strain", value: animal.strain ?? "—" },
                      { label: "Sex", value: animal.sex ?? "—" },
                    ] as const
                  ).map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between gap-3 border-b border-gray-50 pb-2 text-sm last:border-0 last:pb-0"
                    >
                      <span className="shrink-0 text-gray-500">{row.label}</span>
                      <span className="truncate text-right font-medium text-gray-900">{row.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50/90 px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="border-gray-200 bg-white shadow-none" asChild>
                      <Link href={`/${labId}/animals/${animal.id}`}>View details</Link>
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <Link
                        href={`/${labId}/animals/${animal.id}/measurements/new?experimentId=${experiment.id}`}
                      >
                        New record
                      </Link>
                    </Button>
                  </div>
                  {canManageMembers ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onRemoveAnimal(animal.id)}
                      aria-label="Remove animal from experiment"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </TabsContent>
  )
}
