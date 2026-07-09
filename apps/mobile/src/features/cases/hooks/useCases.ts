import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { casesApi } from '@/api/cases.api';
import {
  CASES_REFETCH_INTERVAL_MS,
  casesKeys,
} from '@/features/cases/constants';
import type { CaseListParams, CreateCasePayload } from '@/types';

export function useCases(params: CaseListParams) {
  return useQuery({
    queryKey: casesKeys.list(params),
    queryFn: () => casesApi.list(params),
    refetchInterval: CASES_REFETCH_INTERVAL_MS,
  });
}

export function useCase(id: string) {
  return useQuery({
    queryKey: casesKeys.detail(id),
    queryFn: () => casesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCasePayload) => casesApi.create(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: casesKeys.all });
    },
  });
}
