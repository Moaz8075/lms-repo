import { useQuery } from '@tanstack/react-query';

import { paymentsApi } from '@/api/payments.api';
import { casesKeys } from '@/features/cases/constants';

export function useCasePayments(caseId: string) {
  return useQuery({
    queryKey: casesKeys.payments(caseId),
    queryFn: () => paymentsApi.listByCase(caseId, { page: 1, limit: 50 }),
    enabled: !!caseId,
  });
}
