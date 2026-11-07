"use client"

import { QuickActionRecentActivityCard } from "@/src/components/animals/quick-action-recent-activity-card"
import type { AnimalRecord } from "@/src/app/[labId]/animals/[id]/types"
import { FileText, Microscope, Pill, Stethoscope, Weight } from "lucide-react"
import { AddToExperimentDialog } from "@/src/components/animals/add-to-experiment-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { RecordType, newAnimalRecordPath } from "@/src/app/[labId]/animals/types"
import { Button } from "@/src/components/ui/button"
import { useState } from "react"
import Link from "next/link"

interface QuickActionPanelProps {
  linkedExperimentIds: string[]
  recentRecords: AnimalRecord[]
  onViewAllActivity: () => void
  animalId: string
  userId: string
  labId: string
}

export function QuickActionPanel({
  animalId,
  labId,
  userId,
  linkedExperimentIds,
  recentRecords,
  onViewAllActivity,
}: QuickActionPanelProps) {
  const [addToExperimentOpen, setAddToExperimentOpen] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Link href={`/${labId}/animals/${animalId}/measurements/new`}>
            <Button variant="outline" className="w-full justify-start">
              <Weight className="mr-2 h-4 w-4 text-blue-600" />
              Record Measurement
            </Button>
          </Link>

          <Link href={newAnimalRecordPath(labId, animalId, RecordType.MEDICATION)}>
            <Button variant="outline" className="w-full justify-start">
              <Stethoscope className="mr-2 h-4 w-4 text-blue-600" />
              Add Medical Record
            </Button>
          </Link>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={() => setAddToExperimentOpen(true)}
          >
            <Microscope className="mr-2 h-4 w-4 text-blue-600" />
            Add to Experiment
          </Button>

          <AddToExperimentDialog
            open={addToExperimentOpen}
            onOpenChange={setAddToExperimentOpen}
            animalId={animalId}
            labId={labId}
            userId={userId}
            linkedExperimentIds={linkedExperimentIds}
          />

          <Link href={newAnimalRecordPath(labId, animalId, RecordType.TREATMENT)}>
            <Button variant="outline" className="w-full justify-start">
              <Pill className="mr-2 h-4 w-4 text-blue-600" />
              Record Treatment
            </Button>
          </Link>

          <Link href={newAnimalRecordPath(labId, animalId, RecordType.OBSERVATION)}>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4 text-blue-600" />
              Add Observation
            </Button>
          </Link>
        </CardContent>
      </Card>

      <QuickActionRecentActivityCard records={recentRecords} onViewAll={onViewAllActivity} />
    </div>
  )
}
