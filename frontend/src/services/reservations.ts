import {
  createQueryString,
  requestJson,
} from "@/lib/http";
import type {
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

