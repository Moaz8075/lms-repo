import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import type { PaginationParams } from '@/types';

export function usePayments(params?: PaginationParams & { caseId?: string }) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: () => paymentService.list(params),
  });
}
