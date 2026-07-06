import { api, unwrap } from './api';
import type {
  CreateLibraryItemPayload,
  LibraryItem,
  ListLibraryItemsParams,
  PaginatedResult,
} from '@/types';

export const legalLibraryService = {
  list: (params?: ListLibraryItemsParams) =>
    unwrap<PaginatedResult<LibraryItem>>(api.get('/legal-library', { params })),

  getById: (id: string) => unwrap<LibraryItem>(api.get(`/legal-library/${id}`)),

  create: (payload: CreateLibraryItemPayload) =>
    unwrap<LibraryItem>(api.post('/legal-library', payload)),

  delete: (id: string) => unwrap<LibraryItem>(api.delete(`/legal-library/${id}`)),
};
