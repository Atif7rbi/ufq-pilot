export type TenantUserStatus =
  | "invited"
  | "active"
  | "paused"
  | "suspended"
  | "removed";

export type UserRole =
  | "administrator"
  | "project_manager"
  | "sales"
  | "accountant"
  | "employee";

export type TenantUserIdentity = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  last_login_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type TenantUser = {
  id: string;
  tenant_id: string;
  user_id: number;
  status: TenantUserStatus;
  invited_at: string | null;
  joined_at: string | null;
  removed_at: string | null;
  created_by: number | null;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  user: TenantUserIdentity;
  creator?: {
    id: number;
    name: string;
  } | null;
  updater?: {
    id: number;
    name: string;
  } | null;
};

export type TenantUsersSummary = {
  total: number;
  active: number;
  paused: number;
  limit: number;
};

export type TenantUsersPagination = {
  current_page: number;
  data: TenantUser[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type TenantUsersResponse = {
  data: {
    users: TenantUsersPagination;
    summary: TenantUsersSummary;
  };
};

export type TenantUserResponse = {
  message?: string;
  data: {
    user: TenantUser;
  };
};

export type CreateTenantUserPayload = {
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  password: string;
  password_confirmation: string;
};

export type UpdateTenantUserPayload = {
  name?: string;
  email?: string;
  phone?: string | null;
  role?: UserRole;
  status?: Exclude<
    TenantUserStatus,
    "invited" | "removed"
  >;
  password?: string;
  password_confirmation?: string;
};

export type TenantUsersQuery = {
  page?: number;
  perPage?: number;
  search?: string;
  status?: TenantUserStatus | "";
  role?: UserRole | "";
};
