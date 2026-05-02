const AUTH_TOKEN_COOKIE = "auth-token"

/** Minimal cookie store shape from `cookies()` in next/headers */
type CookieStore = {
  get(name: string): { value: string } | undefined
}

const BACKEND_URL =
  (process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string | undefined)?.trim() ||
  (process.env.NEXT_PUBLIC_DATABASE_URL as string | undefined)?.trim() ||
  ""

function createRequest(
  cookieStore: CookieStore,
  endpoint: string,
  options: RequestInit = {},
) {
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value
  return {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    credentials: "include" as RequestCredentials,
    ...options,
  }
}

async function requestJson(
  cookieStore: CookieStore,
  endpoint: string,
  options: RequestInit = {},
) {
  if (!BACKEND_URL) {
    throw new Error("Backend URL is not configured")
  }
  const config = createRequest(cookieStore, endpoint, options)
  const response = await fetch(`${BACKEND_URL}${endpoint}`, config)

  if (response.status === 401) {
    return undefined
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function createServerApiClient(cookieStore: CookieStore) {
  return {
    get(endpoint: string) {
      return requestJson(cookieStore, endpoint)
    },
    post(endpoint: string, data: unknown) {
      return requestJson(cookieStore, endpoint, {
        method: "POST",
        body: JSON.stringify(data),
      })
    },
    put(endpoint: string, data: unknown) {
      return requestJson(cookieStore, endpoint, {
        method: "PUT",
        body: JSON.stringify(data),
      })
    },
    patch(endpoint: string, data: unknown) {
      return requestJson(cookieStore, endpoint, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
    },
    delete(endpoint: string) {
      return requestJson(cookieStore, endpoint, { method: "DELETE" })
    },
  }
}
