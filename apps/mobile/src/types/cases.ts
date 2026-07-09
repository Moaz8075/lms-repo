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

export interface Case {
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
  filedDate: string | null;
  nextHearingDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  client?: ClientSummary;
  assignedLawyer?: LawyerSummary | null;
}

export interface CaseDetail extends Case {
  description: string | null;
  hearingsCount: number;
  documentsCount: number;
  paymentsSummary: {
    total: number;
    paid: number;
    pending: number;
    count: number;
  };
  expensesSummary: {
    total: number;
    count: number;
  };
}

export interface CreateCasePayload {
  clientId: string;
  opponentParty: string;
  title?: string;
  caseNumber?: string;
  courtName?: string;
  caseType?: string;
  opponentLawyer?: string;
  assignedLawyerId?: string;
  filingDate?: string;
}

export interface CaseListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  caseType?: string;
  clientId?: string;
  assignedLawyerId?: string;
  courtName?: string;
  hearingToday?: boolean;
  ongoing?: boolean;
  filedFrom?: string;
  filedTo?: string;
}

export interface Client {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  city: string | null;
}

export interface Hearing {
  id: string;
  caseId: string;
  hearingDate: string;
  time: string;
  scheduledDate: string;
  courtRoom: string | null;
  purpose: string | null;
  notes: string | null;
  nextHearingDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  caseId: string;
  clientId: string | null;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  notes: string | null;
  paidDate: string | null;
  createdAt: string;
  updatedAt: string;
  recordedBy?: { id: string; name: string; email: string };
}

export interface PaymentListResult {
  items: Payment[];
  summary: {
    totalPaid: number;
    totalPending: number;
    totalPartial: number;
    agreedAmount: number | null;
    remainingBalance: number | null;
  };
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CaseFilters {
  courtName?: string;
  caseType?: string;
  status?: string;
  clientSearch?: string;
  clientId?: string;
  filedFrom?: string;
  filedTo?: string;
}
