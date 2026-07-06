import { api, unwrap } from './api';
import type {
  CaseScopedParams,
  CreatePaymentPayload,
  Payment,
  PaymentsListResult,
  UpdatePaymentPayload,
} from '@/types';

export const paymentService = {
  list: (params: CaseScopedParams) =>
    unwrap<PaymentsListResult>(api.get('/payments', { params })),

  create: (payload: CreatePaymentPayload) =>
    unwrap<Payment>(api.post('/payments', payload)),

  update: (id: string, payload: UpdatePaymentPayload) =>
    unwrap<Payment>(api.patch(`/payments/${id}`, payload)),

  delete: (id: string) => unwrap<void>(api.delete(`/payments/${id}`)),
};
