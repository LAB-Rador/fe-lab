import { AuthService } from "./auth";

const BACKEND_URL =
process.env.NEXT_PUBLIC_LOCAL_DATABASE_URL as string || process.env.NEXT_PUBLIC_DATABASE_URL as string;

class ApiClient {
  baseURL: string; // Объявите свойство baseURL

  constructor() {
    this.baseURL = BACKEND_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const token = AuthService.getToken();
    const { headers: optionHeaders, credentials = "include", ...restOptions } =
      options

    const mergedHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(optionHeaders instanceof Headers
        ? Object.fromEntries(optionHeaders.entries())
        : Array.isArray(optionHeaders)
          ? Object.fromEntries(optionHeaders as [string, string][])
          : (optionHeaders as Record<string, string> | undefined)),
    }

    const config: RequestInit = {
      ...restOptions,
      credentials,
      headers: mergedHeaders,
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);

      if (response.status === 401) {
        AuthService.logout();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  get(endpoint: string) {
    return this.request(endpoint);
  }

  post(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch(endpoint: string, data: any) {
    return this.request(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint: string) {
    return this.request(endpoint, {
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
