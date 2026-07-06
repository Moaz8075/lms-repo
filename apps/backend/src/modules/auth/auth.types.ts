import { Organization, User } from '@prisma/client';
import { UserAccessResponse } from '../../common/permissions';

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: string;
  organizationId: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

export interface SafeOrganization {
  id: string;
  name: string;
  slug: string;
  status: string;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: SafeUser;
  organization: SafeOrganization;
  tokens: AuthTokens;
  permissions: UserAccessResponse;
}

export interface ProfileResponse {
  user: SafeUser;
  organization: SafeOrganization;
  permissions: UserAccessResponse;
}

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    role: user.role,
    organizationId: user.organizationId,
    isActive: user.isActive,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
}

export function toSafeOrganization(organization: Organization): SafeOrganization {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    status: organization.status,
    createdAt: organization.createdAt,
  };
}

export function splitAdminName(adminName: string): {
  firstName: string;
  lastName: string;
} {
  const parts = adminName.trim().split(/\s+/);
  const firstName = parts[0] ?? adminName;
  const lastName = parts.slice(1).join(' ') || firstName;

  return { firstName, lastName };
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
