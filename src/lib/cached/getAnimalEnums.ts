import { cacheLife, cacheTag } from "next/cache"
const BACKEND_URL =
  (process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string) ||
  (process.env.NEXT_PUBLIC_DATABASE_URL as string)
type EnumsResponse = {
  success: boolean
  data: {
    experimentStatus: string[],
    activityLevel: string[],
    accessStatus: string[],
    recordType: string[],
    taskStatus: string[],
    status: string[],
    role: string[],
    sex: string[],
  }
}
export async function getAnimalEnums() {
  "use cache"
  cacheLife("hours")
  cacheTag("animal-enums")
  const response = await fetch(`${BACKEND_URL}/api/animals/enums`, {
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch animal enums: ${response.status}`)
  }
  return response.json() as Promise<EnumsResponse>
}