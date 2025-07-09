"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { LayoutGrid, LayoutList, MoreHorizontal, Edit } from "lucide-react"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Animal, AnimalStatus, Sex } from "./types"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card } from "@/src/components/ui/card"
import { useParams } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { useState } from "react"
import Link from "next/link"

export function AnimalsList({animals}: {animals: Animal[]}) {
  const [view, setView] = useState<"table" | "grid">("table")
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([])
  const params = useParams();
  const { userId, labId } = params;
  
  const toggleAnimalSelection = (id: string) => {
    setSelectedAnimals((prev) => (prev.includes(id) ? prev.filter((animalId) => animalId !== id) : [...prev, id]))
  }

  const toggleAllAnimals = () => {
    setSelectedAnimals((prev) => (prev.length === animals.length ? [] : animals.map((animal) => animal.id || "")))
  }

  const getStatusColor = (status: AnimalStatus) => {
    switch (status) {
      case AnimalStatus.ACTIVE:
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case AnimalStatus.QUARANTINE:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case AnimalStatus.EXPERIMENT:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      case AnimalStatus.BREEDING:
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-100"
      case AnimalStatus.DECEASED:
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case AnimalStatus.TRANSFERRED:
        return "bg-purple-100 text-purple-800 hover:bg-purple-100"
      case AnimalStatus.RETIRED:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100"
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <Checkbox checked={selectedAnimals.length === animals.length} onCheckedChange={toggleAllAnimals} />
          <span className="text-sm text-gray-500">{selectedAnimals.length} selected</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("table")}
            className={view === "table" ? "bg-gray-100" : ""}
          >
            <LayoutList className="h-4 w-4" />
            <span className="sr-only">Table view</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setView("grid")}
            className={view === "grid" ? "bg-gray-100" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
        </div>
      </div>
      {view === "table" ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Identifier</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Laboratory</TableHead>
                <TableHead>Sex</TableHead>
                <TableHead>Strain</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animals.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedAnimals.includes(animal.id || "")}
                    onCheckedChange={() => toggleAnimalSelection(animal.id || "")}
                  />
                </TableCell>
                <TableCell className="font-medium">{animal.identifier}</TableCell>
                <TableCell>
                  <Link href={`/${userId}/${labId}/animals/${animal.id}`} className="text-blue-600 hover:underline">
                    {animal.name}
                  </Link>
                </TableCell>
                <TableCell>{animal.animalType?.name}</TableCell>
                <TableCell>{animal.laboratory?.name}</TableCell>
                <TableCell>{animal.sex}</TableCell>
                <TableCell>{animal.strain}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(animal.status)}>
                    {animal.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {animal.location || "Not specified"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      <Edit className="h-3.5 w-3.5" />
                      <span className="sr-only">Edit animal</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/${userId}/${labId}/animals/${animal.id}`} key={animal.id}>
                          <DropdownMenuItem>View details</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Edit animal</DropdownMenuItem>
                        <DropdownMenuItem>Add measurement</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">Archive animal</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {animals.map((animal) => (
            <div key={animal.id} className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="absolute right-2 top-2">
                <Checkbox
                  checked={selectedAnimals.includes(animal.id || "")}
                  onCheckedChange={() => toggleAnimalSelection(animal.id || "")}
                />
              </div>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                {animal.sex === Sex.MALE && <span className="text-xl">🐭</span>}
                {animal.sex === Sex.FEMALE && <span className="text-xl">🐀</span>}
                {animal.sex === Sex.UNKNOWN && <span className="text-xl">❔</span>}
              </div>
              <h3 className="text-lg font-medium">
                <Link href={`/${userId}/${labId}/animals/${animal.id}`} className="text-blue-600 hover:underline">
                  {animal.name}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">{animal.identifier}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Type</p>
                  <p className="text-gray-500">{animal.animalType?.name}</p>
                </div>
                <div>
                  <p className="font-medium">Sex</p>
                  <p className="text-gray-500">{animal.sex}</p>
                </div>
                <div>
                  <p className="font-medium">Strain</p>
                  <p className="text-gray-500">{animal.strain}</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant="outline" className={getStatusColor(animal.status)}>
                    {animal.status}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="font-medium">Location</p>
                  <p className="text-gray-500">{animal.location || "Not specified"}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-end gap-1">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <Edit className="h-3.5 w-3.5" />
                  <span className="sr-only">Edit animal</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/${userId}/${labId}/animals/${animal.id}`} key={animal.id}>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Edit animal</DropdownMenuItem>
                    <DropdownMenuItem>Add measurement</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">Archive animal</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
