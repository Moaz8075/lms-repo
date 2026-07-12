import { apiClient, unwrap } from '@/api/axios';
import type {
  Client,
  ClientDetail,
  CreateClientPayload,
  ListClientsParams,
  PaginatedResult,
  UpdateClientPayload,
} from '@/types';

export const clientsApi = {
  list: (params?: ListClientsParams) =>
    unwrap<PaginatedResult<Client>>(apiClient.get('/clients', { params })),

  getById: (id: string) =>
    unwrap<ClientDetail>(apiClient.get(`/clients/${id}`)),

  create: (payload: CreateClientPayload) =>
    unwrap<Client>(apiClient.post('/clients', payload)),

  update: (id: string, payload: UpdateClientPayload) =>
    unwrap<Client>(apiClient.patch(`/clients/${id}`, payload)),

  remove: (id: string) =>
    unwrap<Client>(apiClient.delete(`/clients/${id}`)),
};
