import { apiClient, unwrap } from '@/api/axios';
import type {
  CreateHearingPayload,
  Hearing,
  PaginatedResult,
  UpdateHearingPayload,
} from '@/types';

export const hearingsApi = {
  listByCase: (caseId: string, params?: { page?: number; limit?: number }) =>
    unwrap<PaginatedResult<Hearing>>(
      apiClient.get('/hearings', { params: { caseId, ...params } }),
    ),

  create: (payload: CreateHearingPayload) =>
    unwrap<Hearing>(apiClient.post('/hearings', payload)),

  update: (id: string, payload: UpdateHearingPayload) =>
    unwrap<Hearing>(apiClient.patch(`/hearings/${id}`, payload)),
};
