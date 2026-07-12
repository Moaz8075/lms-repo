import { apiClient, unwrap } from '@/api/axios';
import type {
  CreateLibraryItemPayload,
  LibraryItem,
  ListLibraryItemsParams,
  PaginatedResult,
} from '@/types';

export const legalLibraryApi = {
  list: (params?: ListLibraryItemsParams) =>
    unwrap<PaginatedResult<LibraryItem>>(
      apiClient.get('/legal-library', { params }),
    ),

  getById: (id: string) =>
    unwrap<LibraryItem>(apiClient.get(`/legal-library/${id}`)),

  create: (payload: CreateLibraryItemPayload) =>
    unwrap<LibraryItem>(apiClient.post('/legal-library', payload)),

  delete: (id: string) =>
    unwrap<LibraryItem>(apiClient.delete(`/legal-library/${id}`)),
};
