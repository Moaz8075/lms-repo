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
  ASSOCIATE = 'ASSOCIATE',
  CLERK = 'CLERK',
  CLIENT = 'CLIENT',
}

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
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
  status: string;
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

export interface RegisterPayload {
  organizationName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Client {
  id: string;
  organizationId: string;
  firstName: string;
  lastName: string;
  cnic: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface Case {
  id: string;
  organizationId: string;
  clientId: string;
  caseNumber: string;
  title: string;
  status: CaseStatus;
  courtName: string | null;
  nextHearingDate: string | null;
  client?: Pick<Client, 'id' | 'firstName' | 'lastName'>;
  createdAt: string;
}

export interface Hearing {
  id: string;
  organizationId: string;
  caseId: string;
  scheduledDate: string;
  outcome: string;
  courtRoom: string | null;
  nextHearingDate: string | null;
}

export interface Payment {
  id: string;
  organizationId: string;
  caseId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  dueDate: string | null;
  paidDate: string | null;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
