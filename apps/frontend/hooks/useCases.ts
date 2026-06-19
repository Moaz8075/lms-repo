import { useQuery } from '@tanstack/react-query';
import { caseService } from '@/services/case.service';
import type { PaginationParams } from '@/types';

export function useCases(params?: PaginationParams) {
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
