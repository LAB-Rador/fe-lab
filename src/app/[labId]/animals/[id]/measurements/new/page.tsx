import type { AnimalRecord, AnimalRecordMeasurement } from "../../types";
import MeasurementsContainer from "./measurements.container";
import { createServerApiClient } from "@/src/lib/serverApiClient";
import type { PageProps } from "./types";
import { cookies } from "next/headers";

export default async function Page({ params, searchParams }: PageProps) {
  const { labId, id: animalId } = await params;
  const sp = await searchParams;
  const experimentId = typeof sp.experimentId === "string" && sp.experimentId.length > 0 ? sp.experimentId : undefined;
  const cookieStore = await cookies();
  const api = createServerApiClient(cookieStore);
  const userId = await cookieStore.get('USER_ID')?.value || 'default';

  const rows = 100;
  const page = 1;
  const animal = await api.get(`/api/animals/animal/${userId}/${labId}/${animalId}/${rows}/${page}`);
  const animalEnums = await api.get(`/api/animals/enums`);
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
      experimentId={experimentId}
    />
  )
}
