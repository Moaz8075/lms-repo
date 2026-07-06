import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { hearingService } from '@/services/hearing.service';
import type { CaseScopedParams, CreateHearingPayload, UpdateHearingPayload } from '@/types';

export function useHearings(params: CaseScopedParams | undefined) {
  return useQuery({
    queryKey: ['hearings', params],
    queryFn: () => hearingService.list(params!),
    enabled: !!params?.caseId,
  });
}

export function useCreateHearing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHearingPayload) => hearingService.create(payload),
    onSuccess: (_, { caseId }) => {
      queryClient.invalidateQueries({ queryKey: ['hearings'] });
      queryClient.invalidateQueries({ queryKey: ['cases', caseId] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}

export function useUpdateHearing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateHearingPayload }) =>
      hearingService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hearings'] });
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
}
