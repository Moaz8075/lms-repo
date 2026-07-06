import { Payment, User } from '@prisma/client';
import {
  DB_PAYMENT_METHOD_TO_API,
  DB_PAYMENT_STATUS_TO_API,
} from '../../common/enums';

export interface RecorderSummary {
  id: string;
  name: string;
  email: string;
}

export interface PaymentResponse {
  id: string;
  organizationId: string;
  caseId: string;
  clientId: string | null;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  notes: string | null;
  paidDate: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  recordedBy?: RecorderSummary;
}

export interface CasePaymentSummary {
  totalPaid: number;
  totalPending: number;
  totalPartial: number;
  /** Null until case fee/agreed amount is configured on the case */
  agreedAmount: number | null;
  remainingBalance: number | null;
}

export interface ListPaymentsResponse {
  items: PaymentResponse[];
  summary: CasePaymentSummary;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type PaymentWithRecorder = Payment & { recordedBy?: User | null };

export function decimalToNumber(value: { toNumber(): number } | number | null): number {
  if (value == null) return 0;
  return typeof value === 'number' ? value : value.toNumber();
}

export function toRecorderSummary(user: User): RecorderSummary {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
  };
}

export function toPaymentResponse(payment: PaymentWithRecorder): PaymentResponse {
  return {
    id: payment.id,
    organizationId: payment.organizationId,
    caseId: payment.caseId,
    clientId: payment.clientId,
    amount: decimalToNumber(payment.amount),
    currency: payment.currency,
    paymentMethod: DB_PAYMENT_METHOD_TO_API[payment.method] ?? payment.method,
    status: DB_PAYMENT_STATUS_TO_API[payment.status] ?? payment.status,
    notes: payment.description,
    paidDate: payment.paidDate,
    isActive: payment.isActive,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt,
    ...(payment.recordedBy && {
      recordedBy: toRecorderSummary(payment.recordedBy),
    }),
  };
}
