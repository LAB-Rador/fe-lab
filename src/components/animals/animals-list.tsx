"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import type { AnimalPagination } from "@/src/app/[userId]/[labId]/animals/types"
import { LayoutGrid, LayoutList, MoreHorizontal, Edit } from "lucide-react"
import { Checkbox } from "@/src/components/ui/checkbox"
import { Animal, AnimalStatus, Sex } from "./types"
import { Button } from "@/src/components/ui/button"
import { Badge } from "@/src/components/ui/badge"
import { Card } from "@/src/components/ui/card"
import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import Link from "next/link"

interface AnimalsListProps {
  handleUpdateDataPagination: (data: {page?: number, pageSize?: number}) => void;
  setPagination: (pagination: AnimalPagination) => void;
  animalPagination: AnimalPagination;
  animals: Animal[];
}

export function AnimalsList({animals, animalPagination, setPagination, handleUpdateDataPagination}: AnimalsListProps) {
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([])
  const [view, setView] = useState<"table" | "grid">("table")
  const params = useParams();
  const { userId, labId } = params;
  
  const currentAnimals = animals
  const currentPage = animalPagination.currentPage
  const totalPages = animalPagination.totalPages
  const itemsPerPage = animalPagination.pageSize
  const totalCount = animalPagination.totalCount
  
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount)
  
  const pageNumbers = useMemo(() => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }, [currentPage, totalPages])

  const toggleAnimalSelection = (id: string) => {
    setSelectedAnimals((prev) => (prev.includes(id) ? prev.filter((animalId) => animalId !== id) : [...prev, id]))
  }

  const toggleAllAnimals = () => {
    setSelectedAnimals((prev) => (prev.length === currentAnimals.length ? [] : currentAnimals.map((animal) => animal.id || "")))
  }

  const handlePageChange = (page: number) => {
    setPagination({
      ...animalPagination,
      currentPage: page
    })
    handleUpdateDataPagination({page: Number(page)});
    setSelectedAnimals([])
  }

  const handleItemsPerPageChange = (value: string) => {
    setPagination({
      ...animalPagination,
      pageSize: Number(value)
    })
    handleUpdateDataPagination({pageSize: Number(value)});
    setSelectedAnimals([])
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
          <Checkbox checked={selectedAnimals.length === currentAnimals.length && currentAnimals.length > 0} onCheckedChange={toggleAllAnimals} />
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
        <>
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
              {currentAnimals.map((animal) => (
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
          
          <div className="flex flex-col gap-4 px-4 py-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {endIndex} of {totalCount} entries
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Rows per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center sm:justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (animalPagination.hasPreviousPage) handlePageChange(currentPage - 1)
                        }}
                        className={!animalPagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {pageNumbers[0] > 1 && (
                      <>
                        <PaginationItem>
                          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1) }}>
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {pageNumbers[0] > 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                      </>
                    )}
                    
                    {pageNumbers.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); handlePageChange(page) }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                      <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages) }}>
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (animalPagination.hasNextPage) handlePageChange(currentPage + 1)
                        }}
                        className={!animalPagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {currentAnimals.map((animal) => (
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
          
          <div className="flex flex-col gap-4 px-4 py-4 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {endIndex} of {totalCount} entries
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700">Items per page:</span>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                    <SelectItem value="48">48</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center sm:justify-end">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (animalPagination.hasPreviousPage) handlePageChange(currentPage - 1)
                        }}
                        className={!animalPagination.hasPreviousPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {pageNumbers[0] > 1 && (
                      <>
                        <PaginationItem>
                          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(1) }}>
                            1
                          </PaginationLink>
                        </PaginationItem>
                        {pageNumbers[0] > 2 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                      </>
                    )}
                    
                    {pageNumbers.map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); handlePageChange(page) }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    {pageNumbers[pageNumbers.length - 1] < totalPages && (
                      <>
                        {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        <PaginationItem>
                          <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(totalPages) }}>
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault()
                          if (animalPagination.hasNextPage) handlePageChange(currentPage + 1)
                        }}
                        className={!animalPagination.hasNextPage ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
