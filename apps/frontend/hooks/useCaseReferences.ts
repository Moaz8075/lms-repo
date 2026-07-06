import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { caseReferencesService } from '@/services/case-references.service';
import type { AttachCaseReferencePayload } from '@/types';

export function useCaseReferences(caseId: string | undefined) {
  return useQuery({
    queryKey: ['case-references', caseId],
    queryFn: () => caseReferencesService.list(caseId!),
    enabled: !!caseId,
  });
}

export function useAttachCaseReference(caseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AttachCaseReferencePayload) =>
      caseReferencesService.attach(caseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-references', caseId] });
    },
  });
}

export function useDetachCaseReference(caseId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (referenceId: string) =>
      caseReferencesService.detach(caseId, referenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-references', caseId] });
    },
  });
}
