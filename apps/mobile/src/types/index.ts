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

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ORG_ADMIN = 'ORG_ADMIN',
  LAWYER = 'LAWYER',
  SENIOR_LAWYER = 'SENIOR_LAWYER',
  ASSOCIATE = 'ASSOCIATE',
  CLERK = 'CLERK',
  ACCOUNTANT = 'ACCOUNTANT',
  CLIENT = 'CLIENT',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  isActive: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  logo: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  organization: Organization;
  tokens: AuthTokens;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  organizationName: string;
  adminName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface ProfileResponse {
  user: User;
  organization: Organization;
}

export type { Theme } from '@/theme';
export type * from '@/types/dashboard';
export type * from '@/types/cases';
