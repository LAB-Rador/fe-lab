import { headers } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Identity for server-side data fetches. Set by proxy.ts after JWT validation
 * (`x-user-id`).
 */
export async function getServerAuthenticatedUserId(): Promise<string> {
  const id = (await headers()).get("x-user-id")
  if (!id) redirect("/signin")
  return id
}
