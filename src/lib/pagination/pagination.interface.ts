export interface PaginationResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type PaginationQueryParams = {
  page: string | number;
  limit: string | number;
};
