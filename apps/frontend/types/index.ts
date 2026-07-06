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

export enum CaseStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum CaseType {
  CIVIL = 'CIVIL',
  CRIMINAL = 'CRIMINAL',
  FAMILY = 'FAMILY',
  CORPORATE = 'CORPORATE',
  CONSTITUTIONAL = 'CONSTITUTIONAL',
  REVENUE = 'REVENUE',
  OTHER = 'OTHER',
}

export enum HearingOutcome {
  PENDING = 'PENDING',
  ADJOURNED = 'ADJOURNED',
  COMPLETED = 'COMPLETED',
  DISMISSED = 'DISMISSED',
  SETTLED = 'SETTLED',
  WITHDRAWN = 'WITHDRAWN',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PAID = 'paid',
  PARTIAL = 'partial',
  PENDING = 'pending',
}

export enum PaymentMethod {
  CASH = 'cash',
  BANK = 'bank',
  JAZZCASH = 'jazzcash',
  EASYPAISA = 'easypaisa',
}

export enum ExpenseCategory {
  COURT_FEES = 'court_fees',
  FILING_FEE = 'filing_fee',
  TRAVEL = 'travel',
  STATIONERY = 'stationery',
  WITNESS_FEE = 'witness_fee',
  CONSULTATION = 'consultation',
  PHOTOCOPY = 'photocopy',
  NOTARY = 'notary',
  OTHER = 'other',
}

export enum DocumentFileType {
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  DOC = 'DOC',
  OTHER = 'OTHER',
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

/** Roles assignable via the admin team management API */
export enum ApiUserRole {
  OWNER = 'OWNER',
  SENIOR_LAWYER = 'SENIOR_LAWYER',
  ASSOCIATE = 'ASSOCIATE',
  CLERK = 'CLERK',
  ACCOUNTANT = 'ACCOUNTANT',
}

export const API_USER_ROLE_LABELS: Record<ApiUserRole, string> = {
  [ApiUserRole.OWNER]: 'Owner (Admin)',
  [ApiUserRole.SENIOR_LAWYER]: 'Senior Lawyer',
  [ApiUserRole.ASSOCIATE]: 'Associate',
  [ApiUserRole.CLERK]: 'Clerk',
  [ApiUserRole.ACCOUNTANT]: 'Accountant',
};

export interface OrgUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  name: string;
  phone: string | null;
  role: ApiUserRole | string;
  organizationId: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserRolePayload {
  role: ApiUserRole;
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

export interface OrganizationStats {
  totalUsers: number;
  totalClients: number;
  totalCases: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: User;
  organization: Organization;
  tokens: AuthTokens;
  permissions: import('./permissions').UserAccess;
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
  permissions: import('./permissions').UserAccess;
}

export interface LoginPayload {
  email: string;
  password: string;
}

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
  status: CaseStatus;
  courtName: string | null;
  nextHearingDate: string | null;
  createdAt: string;
}

export interface ClientDetail extends Client {
  totalCases: number;
  recentCases: ClientCaseSummary[];
}

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
  caseType: CaseType;
  status: CaseStatus;
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

export interface CaseDetail extends Case {
  description: string | null;
  hearingsCount: number;
  documentsCount: number;
  paymentsSummary: PaymentsSummary;
  expensesSummary: ExpensesSummary;
}

export interface Hearing {
  id: string;
  organizationId: string;
  caseId: string;
  hearingDate: string;
  time: string;
  scheduledDate: string;
  courtRoom: string | null;
  purpose: string | null;
  notes: string | null;
  outcome: HearingOutcome;
  nextHearingDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthorSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type TimelineItemType = 'HEARING' | 'TASK';

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  caseId: string | null;
  caseTitle: string | null;
  courtName: string | null;
  time: string | null;
  description: string | null;
  status: string;
  taskType?: string | null;
  lastHearingDate?: string | null;
}

export interface DiaryCaseRow {
  hearingId: string;
  caseId: string;
  caseNumber: string;
  caseTitle: string;
  clientName: string;
  courtName: string | null;
  courtRoom: string | null;
  hearingTime: string | null;
  todayPurpose: string | null;
  nextHearingDate: string | null;
  nextHearingPurpose: string | null;
}

export interface DailyDiaryResponse {
  date: string;
  hearings: TimelineItem[];
  tasks: TimelineItem[];
  combinedTimeline: TimelineItem[];
  caseRows: DiaryCaseRow[];
  totalCases: number;
}

export interface UpcomingDateGroup {
  date: string;
  label: string;
  items: TimelineItem[];
}

export interface UpcomingDiaryResponse {
  groups: UpcomingDateGroup[];
}

export enum TaskType {
  HEARING = 'HEARING',
  CLIENT_MEETING = 'CLIENT_MEETING',
  DOCUMENT_PREPARATION = 'DOCUMENT_PREPARATION',
  COURT_WORK = 'COURT_WORK',
  PERSONAL = 'PERSONAL',
}

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface UploaderSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Document {
  id: string;
  organizationId: string;
  caseId: string;
  uploadedById: string;
  fileName: string;
  fileUrl: string;
  fileType: DocumentFileType;
  mimeType: string;
  fileSize: number;
  category: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: UploaderSummary;
}

export interface RecorderSummary {
  id: string;
  name: string;
  email: string;
}

export interface Payment {
  id: string;
  organizationId: string;
  caseId: string;
  clientId: string | null;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod | string;
  status: PaymentStatus | string;
  notes: string | null;
  paidDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  recordedBy?: RecorderSummary;
}

export interface CasePaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalPartial: number;
  agreedAmount: number | null;
  remainingBalance: number | null;
}

export interface PaymentsListResult {
  items: Payment[];
  summary: CasePaymentSummary;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Expense {
  id: string;
  organizationId: string;
  caseId: string;
  amount: number;
  currency: string;
  category: ExpenseCategory | string;
  description: string | null;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
  recordedBy?: RecorderSummary;
}

export interface CaseExpenseSummary {
  total: number;
  count: number;
}

export interface ExpensesListResult {
  items: Expense[];
  summary: CaseExpenseSummary;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ListClientsParams extends PaginationParams {
  search?: string;
  cnic?: string;
}

export interface ListCasesParams extends PaginationParams {
  status?: CaseStatus;
  clientId?: string;
  courtName?: string;
  search?: string;
}

export interface CaseScopedParams extends PaginationParams {
  caseId: string;
}

export interface CreateClientPayload {
  name: string;
  fatherName?: string;
  cnic?: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  notes?: string;
}

export interface UpdateClientPayload extends Partial<CreateClientPayload> {}

export interface CreateCasePayload {
  title?: string;
  caseNumber?: string;
  clientId: string;
  courtName?: string;
  caseType?: CaseType;
  opponentParty?: string;
  opponentLawyer?: string;
  assignedLawyerId?: string;
  filingDate?: string;
}

export interface UpdateCasePayload extends Partial<CreateCasePayload> {
  status?: CaseStatus;
  description?: string;
}

export interface CreateHearingPayload {
  caseId: string;
  hearingDate: string;
  time: string;
  courtRoom?: string;
  purpose?: string;
  notes?: string;
  outcome?: HearingOutcome;
}

export interface UpdateHearingPayload extends Partial<Omit<CreateHearingPayload, 'caseId'>> {
  nextHearingDate?: string;
}

export interface UploadDocumentPayload {
  caseId: string;
  fileName: string;
  fileUrl: string;
  fileType: DocumentFileType;
  category?: string;
}

export interface CreatePaymentPayload {
  caseId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  notes?: string;
}

export interface UpdatePaymentPayload extends Partial<Omit<CreatePaymentPayload, 'caseId'>> {}

export interface CreateExpensePayload {
  caseId: string;
  amount: number;
  category: ExpenseCategory;
  expenseDate: string;
  description?: string;
}

export interface UpdateExpensePayload extends Partial<Omit<CreateExpensePayload, 'caseId'>> {}

// ---------------------------------------------------------------------------
// Legal Research
// ---------------------------------------------------------------------------

export interface LibraryItem {
  id: string;
  organizationId: string | null;
  title: string;
  citation: string | null;
  court: string | null;
  jurisdiction: string | null;
  year: number | null;
  category: string | null;
  author: string | null;
  pdfUrl: string;
  totalPages: number;
  description: string | null;
  tags: string[];
  isSystemDocument: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListLibraryItemsParams extends PaginationParams {
  keyword?: string;
  tag?: string;
  court?: string;
  citation?: string;
  category?: string;
}

export interface CreateLibraryItemPayload {
  title: string;
  pdfUrl: string;
  citation?: string;
  court?: string;
  jurisdiction?: string;
  year?: number;
  category?: string;
  author?: string;
  totalPages?: number;
  description?: string;
  tags?: string[];
}

export interface LegalNoteCreator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LegalNoteLibrarySummary {
  id: string;
  title: string;
  pdfUrl: string;
  citation: string | null;
}

export interface LegalNote {
  id: string;
  organizationId: string;
  createdBy: LegalNoteCreator;
  libraryItem: LegalNoteLibrarySummary | null;
  pageNumber: number;
  selectedText: string;
  personalNote: string | null;
  title: string;
  citation: string | null;
  court: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListLegalNotesParams extends PaginationParams {
  keyword?: string;
  tag?: string;
  court?: string;
  citation?: string;
  libraryItemId?: string;
}

export interface CreateLegalNotePayload {
  title: string;
  pageNumber: number;
  selectedText: string;
  personalNote?: string;
  libraryItemId?: string;
  citation?: string;
  court?: string;
  tags?: string[];
}

export interface UpdateLegalNotePayload {
  title?: string;
  personalNote?: string;
  tags?: string[];
}

export interface CaseReference {
  id: string;
  caseId: string;
  legalNote: LegalNote;
  attachedBy: LegalNoteCreator;
  attachedAt: string;
}

export interface AttachCaseReferencePayload {
  legalNoteId: string;
}
