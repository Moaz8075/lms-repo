import { Case, Client, User } from '@prisma/client';
import { DB_ROLE_TO_API } from '../../common/enums';

export interface ClientSummary {
  id: string;
  name: string;
  phone: string;
  cnic: string | null;
}

export interface LawyerSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CaseResponse {
  id: string;
  organizationId: string;
  clientId: string;
  assignedLawyerId: string | null;
  caseNumber: string;
  title: string;
  caseType: string;
  status: string;
  courtName: string | null;
  opposingParty: string | null;
  opposingLawyer: string | null;
  filedDate: Date | null;
  nextHearingDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  client?: ClientSummary;
  assignedLawyer?: LawyerSummary | null;
}

export interface PaymentsSummary {
  total: number;
  paid: number;
  pending: number;
  count: number;
}

export interface ExpensesSummary {
  total: number;
  count: number;
}

export interface CaseDetailResponse extends CaseResponse {
  description: string | null;
  hearingsCount: number;
  documentsCount: number;
  paymentsSummary: PaymentsSummary;
  expensesSummary: ExpensesSummary;
}

type CaseWithRelations = Case & {
  client?: Client;
  assignedLawyer?: User | null;
};

export function toClientSummary(client: Client): ClientSummary {
  return {
    id: client.id,
    name: `${client.firstName} ${client.lastName}`.trim(),
    phone: client.phone,
    cnic: client.cnic,
  };
}

export function toLawyerSummary(user: User): LawyerSummary {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: DB_ROLE_TO_API[user.role] ?? user.role,
  };
}

export function toCaseResponse(caseRecord: CaseWithRelations): CaseResponse {
  return {
    id: caseRecord.id,
    organizationId: caseRecord.organizationId,
    clientId: caseRecord.clientId,
    assignedLawyerId: caseRecord.assignedLawyerId,
    caseNumber: caseRecord.caseNumber,
    title: caseRecord.title,
    caseType: caseRecord.caseType,
    status: caseRecord.status,
    courtName: caseRecord.courtName,
    opposingParty: caseRecord.opposingParty,
    opposingLawyer: caseRecord.opposingLawyer,
    filedDate: caseRecord.filedDate,
    nextHearingDate: caseRecord.nextHearingDate,
    isActive: caseRecord.isActive,
    createdAt: caseRecord.createdAt,
    updatedAt: caseRecord.updatedAt,
    ...(caseRecord.client && { client: toClientSummary(caseRecord.client) }),
    ...(caseRecord.assignedLawyer !== undefined && {
      assignedLawyer: caseRecord.assignedLawyer
        ? toLawyerSummary(caseRecord.assignedLawyer)
        : null,
    }),
  };
}

export function decimalToNumber(value: { toNumber(): number } | number): number {
  return typeof value === 'number' ? value : value.toNumber();
}
