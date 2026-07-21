import { parseApiError } from "@/lib/api-error";
import type {
  Unit,
  UnitFormPayload,
  UnitResponse,
  UnitsResponse,
} from "@/types/unit";

function getApiBaseUrl(): string {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL is not configured."
    );
  }

  return apiBaseUrl;
}

function getHeaders(token: string): HeadersInit {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchUnits(
  token: string,
  params: {
    page?: number;
    per_page?: number;
    search?: string;
    project_id?: string;
    unit_type?: string;
    status?: string;
    archived?: boolean;
  } = {}
): Promise<UnitsResponse> {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  });

  const response = await fetch(
    `${getApiBaseUrl()}/units?${query.toString()}`,
    {
      headers: getHeaders(token),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  return (await response.json()) as UnitsResponse;
}

export async function fetchUnit(
  token: string,
  unitId: string
): Promise<Unit> {
  const response = await fetch(
    `${getApiBaseUrl()}/units/${unitId}`,
    { headers: getHeaders(token) }
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = (await response.json()) as UnitResponse;

  return result.data.unit;
}

export async function createUnit(
  token: string,
  payload: UnitFormPayload
): Promise<Unit> {
  const response = await fetch(`${getApiBaseUrl()}/units`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = (await response.json()) as UnitResponse;

  return result.data.unit;
}

export async function updateUnit(
  token: string,
  unitId: string,
  payload: UnitFormPayload
): Promise<Unit> {
  const response = await fetch(
    `${getApiBaseUrl()}/units/${unitId}`,
    {
      method: "PUT",
      headers: getHeaders(token),
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = (await response.json()) as UnitResponse;

  return result.data.unit;
}

async function changeArchiveState(
  token: string,
  unitId: string,
  action: "archive" | "restore"
): Promise<Unit> {
  const response = await fetch(
    `${getApiBaseUrl()}/units/${unitId}/${action}`,
    {
      method: "POST",
      headers: getHeaders(token),
    }
  );

  if (!response.ok) {
    throw await parseApiError(response);
  }

  const result = (await response.json()) as UnitResponse;

  return result.data.unit;
}

export function archiveUnit(
  token: string,
  unitId: string
): Promise<Unit> {
  return changeArchiveState(token, unitId, "archive");
}

export function restoreUnit(
  token: string,
  unitId: string
): Promise<Unit> {
  return changeArchiveState(token, unitId, "restore");
}
