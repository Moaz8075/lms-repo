import { PaymentMethod, PaymentStatus } from '@prisma/client';

export enum ApiPaymentMethod {
  CASH = 'cash',
  BANK = 'bank',
  JAZZCASH = 'jazzcash',
  EASYPAISA = 'easypaisa',
}

export enum ApiPaymentStatus {
  PAID = 'paid',
  PARTIAL = 'partial',
  PENDING = 'pending',
}

export const API_PAYMENT_METHOD_TO_DB: Record<ApiPaymentMethod, PaymentMethod> = {
  [ApiPaymentMethod.CASH]: PaymentMethod.CASH,
  [ApiPaymentMethod.BANK]: PaymentMethod.BANK_TRANSFER,
  [ApiPaymentMethod.JAZZCASH]: PaymentMethod.JAZZCASH,
  [ApiPaymentMethod.EASYPAISA]: PaymentMethod.EASYPAISA,
};

export const DB_PAYMENT_METHOD_TO_API: Record<string, ApiPaymentMethod | string> = {
  [PaymentMethod.CASH]: ApiPaymentMethod.CASH,
  [PaymentMethod.BANK_TRANSFER]: ApiPaymentMethod.BANK,
  [PaymentMethod.JAZZCASH]: ApiPaymentMethod.JAZZCASH,
  [PaymentMethod.EASYPAISA]: ApiPaymentMethod.EASYPAISA,
};

export const API_PAYMENT_STATUS_TO_DB: Record<ApiPaymentStatus, PaymentStatus> = {
  [ApiPaymentStatus.PAID]: PaymentStatus.PAID,
  [ApiPaymentStatus.PARTIAL]: PaymentStatus.PARTIAL,
  [ApiPaymentStatus.PENDING]: PaymentStatus.PENDING,
};

export const DB_PAYMENT_STATUS_TO_API: Record<string, ApiPaymentStatus | string> = {
  [PaymentStatus.PAID]: ApiPaymentStatus.PAID,
  [PaymentStatus.PARTIAL]: ApiPaymentStatus.PARTIAL,
  [PaymentStatus.PENDING]: ApiPaymentStatus.PENDING,
};
