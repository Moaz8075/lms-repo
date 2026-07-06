import { Case, Client } from '@prisma/client';

export interface ClientResponse {
  id: string;
  organizationId: string;
  name: string;
  firstName: string;
  lastName: string;
  fatherName: string | null;
  cnic: string | null;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  notes: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientCaseSummary {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  courtName: string | null;
  nextHearingDate: Date | null;
  createdAt: Date;
}

export interface ClientDetailResponse extends ClientResponse {
  totalCases: number;
  recentCases: ClientCaseSummary[];
}

export function toClientResponse(client: Client): ClientResponse {
  return {
    id: client.id,
    organizationId: client.organizationId,
    name: `${client.firstName} ${client.lastName}`.trim(),
    firstName: client.firstName,
    lastName: client.lastName,
    fatherName: client.fatherName,
    cnic: client.cnic,
    phone: client.phone,
    whatsapp: client.whatsapp,
    email: client.email,
    address: client.address,
    city: client.city,
    notes: client.notes,
    isActive: client.isActive,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}

export function toClientCaseSummary(caseRecord: Case): ClientCaseSummary {
  return {
    id: caseRecord.id,
    caseNumber: caseRecord.caseNumber,
    title: caseRecord.title,
    status: caseRecord.status,
    courtName: caseRecord.courtName,
    nextHearingDate: caseRecord.nextHearingDate,
    createdAt: caseRecord.createdAt,
  };
}

export function normalizeCnic(cnic?: string | null): string | null {
  if (!cnic) return null;
  const digits = cnic.replace(/\D/g, '');
  if (digits.length !== 13) return cnic.trim();
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
}
