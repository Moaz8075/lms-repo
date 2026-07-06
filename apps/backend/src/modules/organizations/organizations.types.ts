import { Organization } from '@prisma/client';

export interface OrganizationResponse {
  id: string;
  name: string;
  slug: string;
  phone: string | null;
  address: string | null;
  logo: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationStatsResponse {
  totalUsers: number;
  totalClients: number;
  totalCases: number;
}

export function toOrganizationResponse(
  organization: Organization,
): OrganizationResponse {
  return {
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    phone: organization.phone,
    address: organization.address,
    logo: organization.logo,
    status: organization.status,
    createdAt: organization.createdAt,
    updatedAt: organization.updatedAt,
  };
}
