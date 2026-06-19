import { api, unwrap } from './api';
import type { Case, PaginatedResult, PaginationParams } from '@/types';

export const caseService = {
  list: (params?: PaginationParams) =>
    unwrap<PaginatedResult<Case>>(api.get('/cases', { params })),

  getById: (id: string) => unwrap<Case>(api.get(`/cases/${id}`)),
};
