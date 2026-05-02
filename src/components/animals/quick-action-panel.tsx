"use client"

import { QuickActionRecentActivityCard } from "@/src/components/animals/quick-action-recent-activity-card"
import { AlertCircle, Clipboard, FileText, Microscope, Pill, Stethoscope, Weight } from "lucide-react"
import { AddToExperimentDialog } from "@/src/components/animals/add-to-experiment-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { useState } from "react"
import Link from "next/link"

interface QuickActionPanelProps {
  linkedExperimentIds: string[]
  animalId: string
  userId: string
  labId: string
}

export function QuickActionPanel({
  animalId,
  labId,
  userId,
  linkedExperimentIds,
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

          <Button variant="outline" className="w-full justify-start">
            <Stethoscope className="mr-2 h-4 w-4 text-blue-600" />
            Add Medical Record
          </Button>

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

          <Button variant="outline" className="w-full justify-start">
            <Pill className="mr-2 h-4 w-4 text-blue-600" />
            Record Treatment
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4 text-blue-600" />
            Add Observation
          </Button>

          <Button variant="outline" className="w-full justify-start">
            <Clipboard className="mr-2 h-4 w-4 text-blue-600" />
            Generate Report
          </Button>

          <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
            <AlertCircle className="mr-2 h-4 w-4" />
            Report Issue
          </Button>
        </CardContent>
      </Card>

      <QuickActionRecentActivityCard />
    </div>
  )
}
