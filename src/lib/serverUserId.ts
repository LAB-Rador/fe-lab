import { headers } from "next/headers"
import { redirect } from "next/navigation"

/**
 * Identity for server-side data fetches. Set by middleware after JWT validation
 * (see middleware.ts: x-user-id). Do not use the USER_ID cookie for API path segments on the server.
 */
export async function getServerAuthenticatedUserId(): Promise<string> {
  const id = (await headers()).get("x-user-id")
  if (!id) redirect("/signin")
  return id
}
