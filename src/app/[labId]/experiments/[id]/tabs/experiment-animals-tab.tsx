"use client"

import { MousePointer, Plus, Search, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { TabsContent } from "@/src/components/ui/tabs"
import { Card, CardContent } from "@/src/components/ui/card"
import { StatusBadge } from "@/src/components/status-badge"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import type { Animal } from "../../../animals/types"
import type { Experiment } from "../../types"
import Link from "next/link"

export interface ExperimentAnimalsTabProps {
  experiment: Experiment
  labId: string
  canManageMembers: boolean
  addAnimalsOpen: boolean
  onAddAnimalsOpenChange: (open: boolean) => void
  animalSearch: string
  onAnimalSearchChange: (value: string) => void
  animalAddCandidates: Animal[]
  onAddAnimal: (animalId: string) => void | Promise<void>
  onRemoveAnimal: (animalId: string) => void | Promise<void>
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
                  <h3 className="font-semibold text-lg mb-2">{animal.name || animal.identifier}</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="text-gray-500">Species</div>
                    <div>{animal.animalType?.name}</div>
                    <div className="text-gray-500">Strain</div>
                    <div>{animal.strain ?? "—"}</div>
                    <div className="text-gray-500">Sex</div>
                    <div>{animal.sex || "—"}</div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/${labId}/animals/${animal.id}`}>View Details</Link>
                  </Button>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" type="button">
                      Update Status
                    </Button>
                    {canManageMembers && (
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
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </TabsContent>
  )
}
