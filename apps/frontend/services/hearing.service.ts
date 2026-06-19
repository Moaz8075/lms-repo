import { api, unwrap } from './api';
import type { Hearing, PaginatedResult, PaginationParams } from '@/types';

export const hearingService = {
  list: (params?: PaginationParams & { caseId?: string }) =>
    unwrap<PaginatedResult<Hearing>>(api.get('/hearings', { params })),

  getById: (id: string) => unwrap<Hearing>(api.get(`/hearings/${id}`)),
};
