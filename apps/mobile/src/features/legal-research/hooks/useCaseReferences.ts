import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { caseReferencesApi } from '@/api/case-references.api';
import { legalResearchKeys } from '@/features/legal-research/constants';
import type { AttachCaseReferencePayload } from '@/types';

export function useCaseReferences(caseId: string) {
  return useQuery({
    queryKey: legalResearchKeys.caseReferences.list(caseId),
    queryFn: () => caseReferencesApi.list(caseId),
    enabled: !!caseId,
  });
}

export function useAttachNoteToCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      caseId,
      payload,
    }: {
      caseId: string;
      payload: AttachCaseReferencePayload;
    }) => caseReferencesApi.attach(caseId, payload),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: legalResearchKeys.caseReferences.list(variables.caseId),
      });
    },
  });
}

export function useDetachCaseReference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      caseId,
      referenceId,
    }: {
      caseId: string;
      referenceId: string;
    }) => caseReferencesApi.detach(caseId, referenceId),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: legalResearchKeys.caseReferences.list(variables.caseId),
      });
    },
  });
}
