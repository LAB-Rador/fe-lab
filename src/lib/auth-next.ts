export const AUTH_NEXT_COOKIE = "auth-next"

export function safeNextPath(value: string | null | undefined): string | null {
    if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) return null
    if (value.startsWith("/signin") || value.startsWith("/auth/")) return null
    return value
}
