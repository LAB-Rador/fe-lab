export class AuthService {
  static async logout() {
    await fetch("/api/logout", { method: "POST" })
    window.location.href = "/signin"
  }

  static async getCurrentUser() {
    try {
      const response = await fetch("/api/backend/auth/validate", {
        credentials: "include",
      })
      if (!response.ok) return null
      const data = await response.json()
      return data.user ?? null
    } catch {
      return null
    }
  }
}
