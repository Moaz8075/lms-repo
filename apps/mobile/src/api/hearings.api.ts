import { apiClient, unwrap } from '@/api/axios';
import type { Hearing, PaginatedResult } from '@/types';

export const hearingsApi = {
  listByCase: (caseId: string, params?: { page?: number; limit?: number }) =>
    unwrap<PaginatedResult<Hearing>>(
      apiClient.get('/hearings', { params: { caseId, ...params } }),
    ),
};
