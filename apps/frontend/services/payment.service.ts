import { api, unwrap } from './api';
import type { PaginatedResult, PaginationParams, Payment } from '@/types';

export const paymentService = {
  list: (params?: PaginationParams & { caseId?: string }) =>
    unwrap<PaginatedResult<Payment>>(api.get('/payments', { params })),

  getById: (id: string) => unwrap<Payment>(api.get(`/payments/${id}`)),
};
