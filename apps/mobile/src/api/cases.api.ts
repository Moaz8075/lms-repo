import { apiClient, unwrap } from '@/api/axios';
import type {
  Case,
  CaseDetail,
  CaseListParams,
  CreateCasePayload,
  PaginatedResult,
} from '@/types';

export const casesApi = {
  list: (params?: CaseListParams) =>
    unwrap<PaginatedResult<Case>>(apiClient.get('/cases', { params })),

  getById: (id: string) => unwrap<CaseDetail>(apiClient.get(`/cases/${id}`)),

  create: (payload: CreateCasePayload) =>
    unwrap<Case>(apiClient.post('/cases', payload)),
};
