import { apiClient, unwrap } from '@/api/axios';
import type { PaymentListResult } from '@/types';

export const paymentsApi = {
  listByCase: (caseId: string, params?: { page?: number; limit?: number }) =>
    unwrap<PaymentListResult>(
      apiClient.get('/payments', { params: { caseId, ...params } }),
    ),
};
