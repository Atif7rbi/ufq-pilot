import type { Customer } from "@/types/customer";
import type { PaginatedData } from "@/types/pagination";
import type { Unit } from "@/types/unit";

export type ReservationStatus = "active" | "cancelled" | "expired";

export type Reservation = {
  id: string;
  tenant_id: string;
  unit_id: string;
  customer_id: string;
  status: ReservationStatus;
  reserved_at: string;
  expires_at: string;
  notes: string | null;
  cancellation_reason: string | null;
  cancelled_at: string | null;
  cancelled_by: number | string | null;
  created_by: number | string | null;
  updated_by: number | string | null;
  created_at: string;
  updated_at: string;
  unit?: Unit;
  customer?: Customer;
};

export type ReservationPagination = PaginatedData<Reservation>;

export type ReservationSummary = {
  total: number;
  active: number;
  cancelled: number;
  expired: number;
};

export type ReservationsResponse = {
  data: {
    reservations: ReservationPagination;
    summary: ReservationSummary;
  };
};

