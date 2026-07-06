import { api, unwrap } from './api';
import type { AttachCaseReferencePayload, CaseReference } from '@/types';

export const caseReferencesService = {
  list: (caseId: string) =>
    unwrap<CaseReference[]>(api.get(`/cases/${caseId}/references`)),

  attach: (caseId: string, payload: AttachCaseReferencePayload) =>
    unwrap<CaseReference>(api.post(`/cases/${caseId}/references`, payload)),

  detach: (caseId: string, referenceId: string) =>
    unwrap<{ id: string }>(api.delete(`/cases/${caseId}/references/${referenceId}`)),
};
