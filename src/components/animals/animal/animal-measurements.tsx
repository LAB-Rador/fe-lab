"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { ChevronDown, Download, Filter, Plus } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { WeightChart } from "@/src/components/animals/weight-chart"
import { TemperatureChart } from "@/src/components/animals/temperature-chart"
import Link from "next/link"

interface AnimalMeasurementsProps {
  animalId: string
}

export function AnimalMeasurements({ animalId }: AnimalMeasurementsProps) {
  const [view, setView] = useState<"charts" | "table">("charts")

  // This would be fetched from an API in a real application
  const measurements = [
    {
      id: 1,
      date: "2024-03-10",
      type: "Routine Check",
      weight: "28g",
      temperature: "37.2°C",
      bloodPressure: "120/80 mmHg",
      heartRate: "310 bpm",
      respiratoryRate: "85 rpm",
      notes: "Normal behavior observed",
    },
    {
      id: 2,
      date: "2024-03-03",
      type: "Routine Check",
      weight: "27.5g",
      temperature: "37.1°C",
      bloodPressure: "118/78 mmHg",
      heartRate: "315 bpm",
      respiratoryRate: "82 rpm",
      notes: "Slightly increased activity",
    },
    {
      id: 3,
      date: "2024-02-25",
      type: "Treatment",
      weight: "27.2g",
      temperature: "37.4°C",
      bloodPressure: "122/82 mmHg",
      heartRate: "320 bpm",
      respiratoryRate: "88 rpm",
      notes: "Administered medication as prescribed",
    },
    {
      id: 4,
      date: "2024-02-18",
      type: "Routine Check",
      weight: "27.0g",
      temperature: "37.0°C",
      bloodPressure: "119/79 mmHg",
      heartRate: "312 bpm",
      respiratoryRate: "84 rpm",
      notes: "Normal behavior",
    },
    {
      id: 5,
      date: "2024-02-11",
      type: "Routine Check",
      weight: "26.8g",
      temperature: "37.1°C",
      bloodPressure: "117/77 mmHg",
      heartRate: "308 bpm",
      respiratoryRate: "83 rpm",
      notes: "Normal behavior",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant={view === "charts" ? "default" : "outline"} size="sm" onClick={() => setView("charts")}>
            Charts
          </Button>
          <Button variant={view === "table" ? "default" : "outline"} size="sm" onClick={() => setView("table")}>
            Table
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Link href={`/animals/${animalId}/measurements/new`} className="w-full sm:w-auto">
            <Button size="sm" className="flex items-center gap-2 w-full">
              <Plus className="h-4 w-4" />
              New Measurement
            </Button>
          </Link>
        </div>
      </div>

      {view === "charts" ? (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Weight Trend (g)</CardTitle>
            </CardHeader>
            <CardContent>
              <WeightChart measurements={measurements} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Temperature Trend (°C)</CardTitle>
            </CardHeader>
            <CardContent>
              <TemperatureChart measurements={measurements} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Measurement History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Weight</TableHead>
                  <TableHead>Temperature</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements.map((measurement) => (
                  <TableRow key={measurement.id}>
                    <TableCell className="font-medium">{measurement.date}</TableCell>
                    <TableCell>{measurement.type}</TableCell>
                    <TableCell>{measurement.weight}</TableCell>
                    <TableCell>{measurement.temperature}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{measurement.notes}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
