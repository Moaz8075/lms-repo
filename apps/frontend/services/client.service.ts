import { api, unwrap } from './api';
import type {
  Client,
  ClientDetail,
  CreateClientPayload,
  ListClientsParams,
  PaginatedResult,
  UpdateClientPayload,
} from '@/types';

export const clientService = {
  list: (params?: ListClientsParams) =>
    unwrap<PaginatedResult<Client>>(api.get('/clients', { params })),

  getById: (id: string) => unwrap<ClientDetail>(api.get(`/clients/${id}`)),

  create: (payload: CreateClientPayload) =>
    unwrap<Client>(api.post('/clients', payload)),

  update: (id: string, payload: UpdateClientPayload) =>
    unwrap<Client>(api.patch(`/clients/${id}`, payload)),
};
