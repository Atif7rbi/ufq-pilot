import {
  createQueryString,
  requestJson,
} from "@/lib/http";
import type {
  Unit,
  UnitFormPayload,
  UnitResponse,
  UnitsResponse,
} from "@/types/unit";

export type UnitsQuery = {
  page?: number;
  per_page?: number;
  search?: string;
  project_id?: string;
  unit_type?: string;
  status?: string;
  archived?: boolean;
};

export async function fetchUnits(
  token: string,
  params: UnitsQuery = {}
): Promise<UnitsResponse> {
  const query = createQueryString(params);
  const path = query ? `/units?${query}` : "/units";

  return requestJson<UnitsResponse>(path, { token });
}

export async function fetchUnit(
  token: string,
  unitId: string
): Promise<Unit> {
  const result = await requestJson<UnitResponse>(`/units/${unitId}`, {
    token,
  });

  return result.data.unit;
}

export async function createUnit(
  token: string,
  payload: UnitFormPayload
): Promise<Unit> {
  const result = await requestJson<UnitResponse>("/units", {
    token,
    method: "POST",
    body: payload,
  });

  return result.data.unit;
}

export async function updateUnit(
  token: string,
  unitId: string,
  payload: UnitFormPayload
): Promise<Unit> {
  const result = await requestJson<UnitResponse>(`/units/${unitId}`, {
    token,
    method: "PATCH",
    body: payload,
  });

  return result.data.unit;
}

async function changeArchiveState(
  token: string,
  unitId: string,
  action: "archive" | "restore"
): Promise<Unit> {
  const result = await requestJson<UnitResponse>(
    `/units/${unitId}/${action}`,
    {
      token,
      method: "PATCH",
    }
  );

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
