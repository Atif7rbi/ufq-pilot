import {
  createQueryString,
  requestJson,
} from "@/lib/http";
import type {
  AvailableReservationUnit,
  AvailableReservationUnitsResponse,
  Reservation,
  ReservationFormPayload,
  ReservationResponse,
  ReservationsResponse,
} from "@/types/reservation";

export type ReservationsQuery = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  unit_id?: string;
  customer_id?: string;
  project_id?: string;
};

export async function fetchReservations(
  token: string,
  params: ReservationsQuery = {}
): Promise<ReservationsResponse> {
  const query = createQueryString(params);
  const path = query ? `/reservations?${query}` : "/reservations";

  return requestJson<ReservationsResponse>(path, { token });
}

export async function fetchAvailableReservationUnits(
  token: string
): Promise<AvailableReservationUnit[]> {
  const result = await requestJson<AvailableReservationUnitsResponse>(
    "/reservations/available-units",
    { token }
  );

  return result.data.units;
}

export async function createReservation(
  token: string,
  payload: ReservationFormPayload
): Promise<Reservation> {
  const result = await requestJson<ReservationResponse>("/reservations", {
    token,
    method: "POST",
    body: payload,
  });

  return result.data.reservation;
}
