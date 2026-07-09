import { useQuery } from '@tanstack/react-query';

import { clientsApi } from '@/api/clients.api';
import { clientsKeys } from '@/features/cases/constants';

export function useClients(search?: string) {
  return useQuery({
    queryKey: clientsKeys.list(search),
    queryFn: () => clientsApi.list({ page: 1, limit: 50, search: search || undefined }),
  });
}
