import { api, unwrap } from './api';
import type {
  Case,
  CaseDetail,
  CreateCasePayload,
  ListCasesParams,
  PaginatedResult,
  UpdateCasePayload,
} from '@/types';

export const caseService = {
  list: (params?: ListCasesParams) =>
    unwrap<PaginatedResult<Case>>(api.get('/cases', { params })),

  getById: (id: string) => unwrap<CaseDetail>(api.get(`/cases/${id}`)),

  create: (payload: CreateCasePayload) =>
    unwrap<Case>(api.post('/cases', payload)),

  update: (id: string, payload: UpdateCasePayload) =>
    unwrap<Case>(api.patch(`/cases/${id}`, payload)),
};
