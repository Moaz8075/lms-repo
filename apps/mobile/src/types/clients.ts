export interface Client {
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
  createdAt: string;
  updatedAt: string;
}

export interface ClientCaseSummary {
  id: string;
  caseNumber: string;
  title: string;
  status: string;
  courtName: string | null;
  nextHearingDate: string | null;
  createdAt: string;
}

export interface ClientDetail extends Client {
  totalCases: number;
  recentCases: ClientCaseSummary[];
}

export interface ListClientsParams {
  page?: number;
  limit?: number;
  search?: string;
  cnic?: string;
}

export interface CreateClientPayload {
  name: string;
  phone: string;
  fatherName?: string;
  cnic?: string;
  whatsapp?: string;
  address?: string;
  notes?: string;
}

export interface UpdateClientPayload {
  name?: string;
  phone?: string;
  fatherName?: string;
  cnic?: string;
  whatsapp?: string;
  address?: string;
  notes?: string;
}
