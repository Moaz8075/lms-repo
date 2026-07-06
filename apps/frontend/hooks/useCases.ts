import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { caseService } from '@/services/case.service';
import type { CreateCasePayload, ListCasesParams, UpdateCasePayload } from '@/types';

export function useCases(params?: ListCasesParams) {
  return useQuery({
    queryKey: ['cases', params],
    queryFn: () => caseService.list(params),
  });
}

export function useCase(id: string) {
  return useQuery({
    queryKey: ['cases', id],
    queryFn: () => caseService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCasePayload) => caseService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['organization', 'stats'] });
    },
  });
}

export function useUpdateCase() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCasePayload }) =>
      caseService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      queryClient.invalidateQueries({ queryKey: ['cases', id] });
    },
  });
}
