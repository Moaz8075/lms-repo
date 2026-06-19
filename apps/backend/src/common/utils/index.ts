import { PaginatedResult } from '../interfaces';

export * from './password.util';

export function buildPaginatedResult<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 0,
  };
}

export function getPaginationParams(page = 1, limit = 20) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, limit);

  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
    page: safePage,
    limit: safeLimit,
  };
}

export function omitPassword<T extends Record<string, unknown>>(
  user: T,
): Omit<T, 'password'> {
  const { password: _password, ...rest } = user;
  return rest;
}
