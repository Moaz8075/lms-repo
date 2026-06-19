import { useQuery } from '@tanstack/react-query';
import { clientService } from '@/services/client.service';
import type { PaginationParams } from '@/types';

export function useClients(params?: PaginationParams) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.list(params),
  });
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['clients', id],
    queryFn: () => clientService.getById(id),
    enabled: !!id,
  });
}
