import { useQuery } from '@tanstack/react-query';

import { hearingsApi } from '@/api/hearings.api';
import { casesKeys } from '@/features/cases/constants';

export function useCaseHearings(caseId: string) {
  return useQuery({
    queryKey: casesKeys.hearings(caseId),
    queryFn: () => hearingsApi.listByCase(caseId, { page: 1, limit: 50 }),
    enabled: !!caseId,
  });
}
