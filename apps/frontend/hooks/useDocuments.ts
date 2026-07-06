import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/services/document.service';
import type { CaseScopedParams, UploadDocumentPayload } from '@/types';

export function useDocuments(params: CaseScopedParams | undefined) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: () => documentService.list(params!),
    enabled: !!params?.caseId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UploadDocumentPayload) => documentService.upload(payload),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['cases', caseId] });
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
