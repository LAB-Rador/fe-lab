import type { ExperimentAnimalRecordMeasurement, ExperimentAnimalRecordRow } from "./types"

/** Shape returned by POST /api/animal-records (Prisma JSON). */
export type CreatedAnimalRecordApi = {
  id: string
  animalId: string
  experimentId?: string | null
  recordType: string
  date: string | Date
  createdById: string
  temperature: number | null
  weight: number | null
  feedIntake: number | null
  waterIntake: number | null
  activityLevel: string | null
  notes: string | null
  measurements: ExperimentAnimalRecordMeasurement[]
}

export type AnimalSummaryForRecord = {
  id: string
  name: string | null
  identifier: string
}

/** POST payload does not include nested `animal`; we attach it from the current page. */
export function mapCreatedRecordToExperimentRow(
  created: CreatedAnimalRecordApi,
  animal: AnimalSummaryForRecord,
): ExperimentAnimalRecordRow {
  const dateIso =
    typeof created.date === "string" ? created.date : new Date(created.date).toISOString()

  return {
    id: created.id,
    animalId: created.animalId,
    experimentId: created.experimentId ?? null,
    recordType: created.recordType,
    date: dateIso,
    createdById: created.createdById,
    temperature: created.temperature,
    weight: created.weight,
    feedIntake: created.feedIntake,
    waterIntake: created.waterIntake,
    activityLevel: created.activityLevel,
    notes: created.notes,
    animal: {
      id: animal.id,
      name: animal.name,
      identifier: animal.identifier,
    },
    measurements: Array.isArray(created.measurements)
      ? created.measurements.map((m) => ({
          parameter: m.parameter,
          value: m.value,
          unit: m.unit ?? null,
        }))
      : [],
  }
}
