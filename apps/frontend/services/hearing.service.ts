import { api, unwrap } from './api';
import type {
  CaseScopedParams,
  CreateHearingPayload,
  Hearing,
  PaginatedResult,
  UpdateHearingPayload,
} from '@/types';

export const hearingService = {
  list: (params: CaseScopedParams) =>
    unwrap<PaginatedResult<Hearing>>(api.get('/hearings', { params })),

  create: (payload: CreateHearingPayload) =>
    unwrap<Hearing>(api.post('/hearings', payload)),

  update: (id: string, payload: UpdateHearingPayload) =>
    unwrap<Hearing>(api.patch(`/hearings/${id}`, payload)),
};
