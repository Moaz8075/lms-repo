export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors: string[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface JwtPayload {
  sub: string;
  email: string;
  organizationId: string;
  role: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  organizationId: string;
  role: string;
}

export interface TenantContext {
  organizationId: string;
  userId: string;
  role: string;
}
