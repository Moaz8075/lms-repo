import { apiClient, unwrap } from '@/api/axios';
import type { AttachCaseReferencePayload, CaseReference } from '@/types';

export const caseReferencesApi = {
  list: (caseId: string) =>
    unwrap<CaseReference[]>(apiClient.get(`/cases/${caseId}/references`)),

  attach: (caseId: string, payload: AttachCaseReferencePayload) =>
    unwrap<CaseReference>(
      apiClient.post(`/cases/${caseId}/references`, payload),
    ),

  detach: (caseId: string, referenceId: string) =>
    unwrap<{ id: string }>(
      apiClient.delete(`/cases/${caseId}/references/${referenceId}`),
    ),
};
