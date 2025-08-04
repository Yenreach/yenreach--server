import { PaginationResponse } from './pagination.interface';

export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginationResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    page,
    limit,
    total,
    totalPages,
  };
}

export function calculatePagination(
  page = 1,
  limit = 10
): { skip: number; limit: number } {
  const skip = (page - 1) * limit;
  return { skip, limit };
}
