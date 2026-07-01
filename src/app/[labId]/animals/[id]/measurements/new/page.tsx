import type { AnimalRecord, AnimalRecordMeasurement } from "../../types";
import { getServerAuthenticatedUserId } from "@/src/lib/serverUserId";
import { getAnimalEnums } from "@/src/lib/cached/getAnimalEnums";
import MeasurementsContainer from "./measurements.container";
import { serverApiClient } from "@/src/lib/serverApiClient";
import type { AnimalEnums } from "../../../types";
import type { PageProps } from "./types";

const rows = 100;
const page = 1;

export default async function Page({ params, searchParams }: PageProps) {
  const { labId, id: animalId } = await params;
  const sp = await searchParams;
  const experimentId = typeof sp.experimentId === "string" && sp.experimentId.length > 0 ? sp.experimentId : undefined;
  const userId = await getServerAuthenticatedUserId()
  
  const [animal, animalEnums ] = await Promise.all([
    serverApiClient.get(`/api/animals/animal/${userId}/${labId}/${animalId}/${rows}/${page}`),
    getAnimalEnums(),
  ]);
  const measurements = await animal.data.records.map((record: AnimalRecord) => record.measurements);

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
      animalEnums={animalEnums.data as AnimalEnums}
      experimentId={experimentId}
      animalId={animalId}
      userId={userId}
      labId={labId}
      animalSummary={{
        id: animalId,
        name: animal.data?.name ?? null,
        identifier: animal.data?.identifier ?? "",
      }}
    />
  )
}
