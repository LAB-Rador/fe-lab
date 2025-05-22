"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { LayoutGrid, LayoutList, MoreHorizontal } from "lucide-react"
import Link from "next/link"

interface Animal {
  id: string
  name: string
  species: string
  sex: "Male" | "Female"
  age: string
  status: "Healthy" | "Under Observation" | "Critical" | "In Experiment"
}

const animals: Animal[] = [
  {
    id: "M-1001",
    name: "Alpha",
    species: "Mouse",
    sex: "Male",
    age: "6 months",
    status: "Healthy",
  },
  {
    id: "M-1002",
    name: "Beta",
    species: "Mouse",
    sex: "Female",
    age: "4 months",
    status: "In Experiment",
  },
  {
    id: "R-2001",
    name: "Gamma",
    species: "Rat",
    sex: "Male",
    age: "8 months",
    status: "Under Observation",
  },
  {
    id: "B-3001",
    name: "Delta",
    species: "Bird",
    sex: "Female",
    age: "1 year",
    status: "Healthy",
  },
  {
    id: "F-4001",
    name: "Epsilon",
    species: "Fish",
    sex: "Male",
    age: "3 months",
    status: "Critical",
  },
  {
    id: "M-1003",
    name: "Zeta",
    species: "Mouse",
    sex: "Female",
    age: "5 months",
    status: "Healthy",
  },
  {
    id: "R-2002",
    name: "Eta",
    species: "Rat",
    sex: "Male",
    age: "7 months",
    status: "In Experiment",
  },
  {
    id: "B-3002",
    name: "Theta",
    species: "Bird",
    sex: "Female",
    age: "9 months",
    status: "Healthy",
  },
]

export function AnimalsList() {
  const [view, setView] = useState<"table" | "grid">("table")
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([])

  const toggleAnimalSelection = (id: string) => {
    setSelectedAnimals((prev) => (prev.includes(id) ? prev.filter((animalId) => animalId !== id) : [...prev, id]))
  }

  const toggleAllAnimals = () => {
    setSelectedAnimals((prev) => (prev.length === animals.length ? [] : animals.map((animal) => animal.id)))
  }

  const getStatusColor = (status: Animal["status"]) => {
    switch (status) {
      case "Healthy":
        return "bg-green-50 text-green-700 border-green-200"
      case "Under Observation":
        return "bg-yellow-50 text-yellow-700 border-yellow-200"
      case "Critical":
        return "bg-red-50 text-red-700 border-red-200"
      case "In Experiment":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
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
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Sex</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animals.map((animal) => (
              <TableRow key={animal.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedAnimals.includes(animal.id)}
                    onCheckedChange={() => toggleAnimalSelection(animal.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{animal.id}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/animals/${animal.id}`} className="text-blue-600 hover:underline">
                    {animal.name}
                  </Link>
                </TableCell>
                <TableCell>{animal.species}</TableCell>
                <TableCell>{animal.sex}</TableCell>
                <TableCell>{animal.age}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(animal.status)}>
                    {animal.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link href={`/dashboard/animals/${animal.id}`} key={animal.id}>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem>Edit animal</DropdownMenuItem>
                      <DropdownMenuItem>Add measurement</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Archive animal</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                  checked={selectedAnimals.includes(animal.id)}
                  onCheckedChange={() => toggleAnimalSelection(animal.id)}
                />
              </div>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                {animal.species === "Mouse" && <span className="text-xl">🐭</span>}
                {animal.species === "Rat" && <span className="text-xl">🐀</span>}
                {animal.species === "Bird" && <span className="text-xl">🐦</span>}
                {animal.species === "Fish" && <span className="text-xl">🐟</span>}
              </div>
              <h3 className="text-lg font-medium">
                <Link href={`/dashboard/animals/${animal.id}`} className="text-blue-600 hover:underline">
                  {animal.name}
                </Link>
              </h3>
              <p className="text-sm text-gray-500">{animal.id}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="font-medium">Species</p>
                  <p className="text-gray-500">{animal.species}</p>
                </div>
                <div>
                  <p className="font-medium">Sex</p>
                  <p className="text-gray-500">{animal.sex}</p>
                </div>
                <div>
                  <p className="font-medium">Age</p>
                  <p className="text-gray-500">{animal.age}</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant="outline" className={getStatusColor(animal.status)}>
                    {animal.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/dashboard/animals/${animal.id}`} key={animal.id}>
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
