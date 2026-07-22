import { parseApiError } from "@/lib/api-error";

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type JsonRequestOptions = {
  token: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  cache?: RequestCache;
};

export function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured.");
  }

  return apiBaseUrl;
}

export function createAuthHeaders(
  token: string,
  hasJsonBody = false
): HeadersInit {
  return {
    Accept: "application/json",
    ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
}

export function createQueryString(params: QueryParams): string {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  return query.toString();
}

export async function requestJson<T>(
  path: string,
  {
    token,
    method = "GET",
    body,
    cache = "no-store",
  }: JsonRequestOptions
): Promise<T> {
  const hasJsonBody = body !== undefined;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers: createAuthHeaders(token, hasJsonBody),
    ...(hasJsonBody ? { body: JSON.stringify(body) } : {}),
    cache,
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return (await response.json()) as T;
}
