export type PaginatedData<T> = {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
};
