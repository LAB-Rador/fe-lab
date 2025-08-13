import type { AnimalRecord, AnimalRecordMeasurement } from "../../types";
import MeasurementsContainer from "./measurements.container";
import { apiClient } from "@/src/lib/apiClient";

export default async function Page({ params }: {params: {userId: string, labId: string, id: string}}) {
  const { userId, labId, id: animalId } = await params;
  const rows = 100;
  const page = 1;
  const animal = await apiClient.get(`/api/animals/animal/${userId}/${labId}/${animalId}/${rows}/${page}`);
  const animalEnums = await apiClient.get(`/api/animals/enums`);
  const measurements = animal.data.records.map((record: AnimalRecord) => record.measurements);

  const uniqueMeasurements = measurements.flat().reduce((acc: AnimalRecordMeasurement[], current: AnimalRecordMeasurement) => {
    const x = acc.find(item => item.parameter === current.parameter);
    if (!x) {
      acc.push(current);
    }
    return acc;
  }, []);

  return (
    <MeasurementsContainer
      measurements={uniqueMeasurements}
      animalEnums={animalEnums.data}
      animalId={animalId}
      userId={userId}
      labId={labId}
    />
  )
}
