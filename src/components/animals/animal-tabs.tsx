"use client"

import { AnimalMedicalRecords } from "@/src/components/animals/animal/animal-medical-records"
import { AnimalMeasurements } from "@/src/components/animals/animal/animal-measurements"
import { AnimalExperiments } from "@/src/components/animals/animal/animal-experiments"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { AnimalBasicInfo } from "@/src/components/animals/animal/animal-basic-info"
import { AnimalGenealogy } from "@/src/components/animals/animal/animal-genealogy"
import type { AnimalPagination } from "@/src/app/[labId]/animals/types"
import { AnimalStatus, Sex } from "@/src/components/animals/types"
import type { Animal } from "@/src/app/[labId]/animals/[id]/types"
import { useCallback, useMemo, useState } from "react"
import { Card } from "@/src/components/ui/card"

interface AnimalTabsProps {
  id: string
  labId: string
  type: string
  strain: string
  sex: string
  birthDate: string
  age: string
  weight: string
  location: string
}

export function AnimalTabs({
  id,
  labId,
  type,
  strain,
  sex,
  birthDate,
  location,
}: AnimalTabsProps) {
  const [activeTab, setActiveTab] = useState("basic-info")

  const animal = useMemo((): Animal => {
    const s = sex.trim().toUpperCase()
    const sexEnum =
      s === "MALE" ? Sex.MALE : s === "FEMALE" ? Sex.FEMALE : Sex.UNKNOWN

    return {
      id,
      identifier: id,
      acquisitionDate: new Date().toISOString(),
      animalType: {
        name: type,
        description: null,
        laboratoryId: "",
      },
      laboratory: {
        name: labId,
      },
      laboratoryId: "",
      animalTypeId: "",
      status: AnimalStatus.ACTIVE,
      records: [],
      strain: strain || undefined,
      sex: sexEnum,
      birthDate: birthDate || undefined,
      location: location || undefined,
    }
  }, [id, labId, type, strain, sex, birthDate, location])

  const pagination = useMemo(
    (): AnimalPagination => ({
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    }),
    [],
  )

  const handleUpdateDataPagination = useCallback(
    (_data: { page?: number; pageSize?: number }) => {},
    [],
  )

  return (
    <Card>
      <Tabs defaultValue="basic-info" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 rounded-none border-b">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="measurements">Measurements</TabsTrigger>
          <TabsTrigger value="medical-records">Medical Records</TabsTrigger>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="genealogy">Genealogy</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <AnimalBasicInfo animal={animal} />
        </TabsContent>
        <TabsContent value="measurements">
          <AnimalMeasurements
            labId={labId}
            animalId={animal.id ?? id}
            animal={animal}
            pagination={pagination}
            handleUpdateDataPagination={handleUpdateDataPagination}
          />
        </TabsContent>
        <TabsContent value="medical-records">
          <AnimalMedicalRecords animalId={animal.id ?? id} />
        </TabsContent>
        <TabsContent value="experiments">
          <AnimalExperiments labId={labId} experiments={animal.experimentAnimals ?? []} />
        </TabsContent>
        <TabsContent value="genealogy">
          <AnimalGenealogy animalId={animal.id ?? id} />
        </TabsContent>
      </Tabs>
    </Card>
  )
}
