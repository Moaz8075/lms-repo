import { api, unwrap } from './api';
import type { Client, PaginatedResult, PaginationParams } from '@/types';

export const clientService = {
  list: (params?: PaginationParams) =>
    unwrap<PaginatedResult<Client>>(api.get('/clients', { params })),

  getById: (id: string) => unwrap<Client>(api.get(`/clients/${id}`)),
};
