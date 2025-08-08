import MeasurementsContainer from "./measurements.container"
import { apiClient } from "@/src/lib/apiClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const animalEnums = await apiClient.get(`/api/animals/enums`);
  return (
    <MeasurementsContainer params={params} animalEnums={animalEnums.data} />
  )
}
