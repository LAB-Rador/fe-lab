"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { ArrowLeft, Calendar, Clock, ImageIcon, Plus, Trash, Upload } from "lucide-react"
import { Separator } from "@/src/components/ui/separator"
import { Textarea } from "@/src/components/ui/textarea"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import Link from "next/link"
import { use } from "react"

export default function NewMeasurementPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const {userId, labId} = useParams();
  const animalId = resolvedParams.id;
  const router = useRouter();
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Link href={`/${userId}/${labId}/animals/${animalId}`}>
            <Button 
              onClick={() => {
                router.back()
              }}
              variant="ghost" 
              size="sm" 
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Animal
            </Button>
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <h1 className="text-2xl font-bold">New Measurement</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Record Measurement</CardTitle>
            <CardDescription>Record new measurements and observations for animal {animalId}</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-8">
              {/* Record Type and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="record-type">Record Type</Label>
                  <Select defaultValue="routine">
                    <SelectTrigger id="record-type">
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Check</SelectItem>
                      <SelectItem value="treatment">Treatment</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="experiment">Experiment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Input id="date" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                      <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <div className="relative">
                      <Input id="time" type="time" defaultValue={new Date().toTimeString().slice(0, 5)} />
                      <Clock className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Parameters */}
              <div>
                <h3 className="text-lg font-medium mb-4">Standard Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (g)</Label>
                    <Input id="weight" type="number" step="0.1" placeholder="Enter weight" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input id="temperature" type="number" step="0.1" placeholder="Enter temperature" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
                    <Input id="heart-rate" type="number" placeholder="Enter heart rate" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="respiratory-rate">Respiratory Rate (rpm)</Label>
                    <Input id="respiratory-rate" type="number" placeholder="Enter respiratory rate" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="blood-pressure">Blood Pressure (mmHg)</Label>
                    <div className="flex gap-2">
                      <Input id="blood-pressure-systolic" type="number" placeholder="Systolic" />
                      <span className="flex items-center">/</span>
                      <Input id="blood-pressure-diastolic" type="number" placeholder="Diastolic" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Parameters */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Additional Parameters</h3>
                  <Button type="button" variant="outline" size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Parameter
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="blood-glucose">Blood Glucose (mg/dL)</Label>
                      <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                    <Input id="blood-glucose" type="number" placeholder="Enter value" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="hydration">Hydration Status (%)</Label>
                      <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-500">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                    <Input id="hydration" type="number" placeholder="Enter value" />
                  </div>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <h3 className="text-lg font-medium mb-4">Photos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <div className="bg-gray-100 rounded-full p-3 mb-2">
                      <Upload className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium mb-1">Drag and drop files here</p>
                    <p className="text-xs text-gray-500 mb-3">or click to browse</p>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                    <input type="file" className="hidden" accept="image/*" />
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center mb-3">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500 text-center">Photo preview will appear here</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any additional observations or notes"
                  className="min-h-[120px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3">
                <Link href={`/animals/${animalId}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit">Save Measurement</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
