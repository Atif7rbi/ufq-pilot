import {
  createQueryString,
  requestJson,
} from "@/lib/http";
import type {
  AvailableReservationUnit,
  AvailableReservationUnitsResponse,
  Reservation,
  ReservationCancellationPayload,
  ReservationFormPayload,
  ReservationResponse,
  ReservationUpdatePayload,
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
  token: string,
  projectId: string
): Promise<AvailableReservationUnit[]> {
  const query = createQueryString({ project_id: projectId });
  const result = await requestJson<AvailableReservationUnitsResponse>(
    `/reservations/available-units?${query}`,
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

export async function fetchReservation(
  token: string,
  reservationId: string
): Promise<Reservation> {
  const result = await requestJson<ReservationResponse>(
    `/reservations/${reservationId}`,
    { token }
  );

  return result.data.reservation;
}

export async function updateReservation(
  token: string,
  reservationId: string,
  payload: ReservationUpdatePayload
): Promise<Reservation> {
  const result = await requestJson<ReservationResponse>(
    `/reservations/${reservationId}`,
    {
      token,
      method: "PATCH",
      body: payload,
    }
  );

  return result.data.reservation;
}

export async function cancelReservation(
  token: string,
  reservationId: string,
  payload: ReservationCancellationPayload
): Promise<Reservation> {
  const result = await requestJson<ReservationResponse>(
    `/reservations/${reservationId}/cancel`,
    {
      token,
      method: "PATCH",
      body: payload,
    }
  );

  return result.data.reservation;
}
