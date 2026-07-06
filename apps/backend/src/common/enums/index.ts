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

/** API-facing role names mapped to database UserRole values */
export enum ApiUserRole {
  OWNER = 'OWNER',
  SENIOR_LAWYER = 'SENIOR_LAWYER',
  ASSOCIATE = 'ASSOCIATE',
  CLERK = 'CLERK',
  ACCOUNTANT = 'ACCOUNTANT',
}

export const API_ROLE_TO_DB: Record<ApiUserRole, UserRole> = {
  [ApiUserRole.OWNER]: UserRole.ORG_ADMIN,
  [ApiUserRole.SENIOR_LAWYER]: UserRole.SENIOR_LAWYER,
  [ApiUserRole.ASSOCIATE]: UserRole.ASSOCIATE,
  [ApiUserRole.CLERK]: UserRole.CLERK,
  [ApiUserRole.ACCOUNTANT]: UserRole.ACCOUNTANT,
};

export const DB_ROLE_TO_API: Record<string, ApiUserRole | string> = {
  [UserRole.ORG_ADMIN]: ApiUserRole.OWNER,
  [UserRole.LAWYER]: ApiUserRole.SENIOR_LAWYER,
  [UserRole.SENIOR_LAWYER]: ApiUserRole.SENIOR_LAWYER,
  [UserRole.ASSOCIATE]: ApiUserRole.ASSOCIATE,
  [UserRole.CLERK]: ApiUserRole.CLERK,
  [UserRole.ACCOUNTANT]: ApiUserRole.ACCOUNTANT,
};

export enum OrganizationStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL',
  INACTIVE = 'INACTIVE',
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

export enum HearingStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  ADJOURNED = 'ADJOURNED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum DocumentType {
  PETITION = 'PETITION',
  ORDER = 'ORDER',
  EVIDENCE = 'EVIDENCE',
  CORRESPONDENCE = 'CORRESPONDENCE',
  OTHER = 'OTHER',
}

export { DocumentFileType, DOCUMENT_FILE_TYPE_MIME } from './document-file-type.enum';
export {
  ApiPaymentMethod,
  ApiPaymentStatus,
  API_PAYMENT_METHOD_TO_DB,
  DB_PAYMENT_METHOD_TO_API,
  API_PAYMENT_STATUS_TO_DB,
  DB_PAYMENT_STATUS_TO_API,
} from './payment.enum';
export {
  ApiExpenseCategory,
  API_EXPENSE_CATEGORY_TO_DB,
  DB_EXPENSE_CATEGORY_TO_API,
} from './expense.enum';
