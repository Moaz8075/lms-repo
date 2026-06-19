import { useQuery } from '@tanstack/react-query';
import { hearingService } from '@/services/hearing.service';
import type { PaginationParams } from '@/types';

export function useHearings(params?: PaginationParams & { caseId?: string }) {
  return useQuery({
    queryKey: ['hearings', params],
    queryFn: () => hearingService.list(params),
  });
}
