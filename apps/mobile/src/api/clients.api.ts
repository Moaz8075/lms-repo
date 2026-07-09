import { apiClient, unwrap } from '@/api/axios';
import type { Client, PaginatedResult } from '@/types';

export const clientsApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    unwrap<PaginatedResult<Client>>(apiClient.get('/clients', { params })),
};
