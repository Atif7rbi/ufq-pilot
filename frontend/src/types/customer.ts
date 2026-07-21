export type CustomerType =
  | "individual"
  | "company";

export type CustomerCategory =
  | "investor"
  | "buyer"
  | "broker"
  | "owner"
  | "other";

export type CustomerStatus =
  | "lead"
  | "customer"
  | "inactive"
  | "archived";

export type EditableCustomerStatus =
  Exclude<CustomerStatus, "archived">;

export type Customer = {
  id: string;
  tenant_id?: string;
  type: CustomerType;
  category: CustomerCategory;
  status: CustomerStatus;
  name: string;
  phone: string;
  email: string | null;
  national_id: string | null;
  commercial_registration_number:
    | string
    | null;
  city: string | null;
  address: string | null;
  notes: string | null;
  archived_at: string | null;
  created_by?: number | string | null;
  updated_by?: number | string | null;
  archived_by?: number | string | null;
  restored_by?: number | string | null;
  created_at: string;
  updated_at: string;
};

export type CustomerFormPayload = {
  type: CustomerType;
  category: CustomerCategory;
  status: EditableCustomerStatus;
  name: string;
  phone: string;
  email?: string | null;
  national_id?: string | null;
  commercial_registration_number?:
    | string
    | null;
  city?: string | null;
  address?: string | null;
  notes?: string | null;
};

export type CustomerPagination = {
  current_page: number;
  data: Customer[];
  first_page_url?: string;
  from: number | null;
  last_page: number;
  last_page_url?: string;
  links?: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path?: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type CustomersResponse = {
  data: CustomerPagination;
};

export type CustomerResponse = {
  message?: string;
  data: {
    customer: Customer;
  };
};
