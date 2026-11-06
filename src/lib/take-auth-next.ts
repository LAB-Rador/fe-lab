import { AUTH_NEXT_COOKIE, safeNextPath } from "@/src/lib/auth-next"
import { cookies } from "next/headers"

export async function takeAuthNext(): Promise<string | null> {
    const store = await cookies()
    const raw = store.get(AUTH_NEXT_COOKIE)?.value
    if (raw) store.delete(AUTH_NEXT_COOKIE)
    if (!raw) return null
    try {
        return safeNextPath(decodeURIComponent(raw))
    } catch {
        return null
    }
}
