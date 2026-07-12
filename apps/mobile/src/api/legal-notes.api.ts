import { apiClient, unwrap } from '@/api/axios';
import type {
  CreateLegalNotePayload,
  LegalNote,
  ListLegalNotesParams,
  PaginatedResult,
  UpdateLegalNotePayload,
} from '@/types';

export const legalNotesApi = {
  list: (params?: ListLegalNotesParams) =>
    unwrap<PaginatedResult<LegalNote>>(apiClient.get('/legal-notes', { params })),

  getById: (id: string) => unwrap<LegalNote>(apiClient.get(`/legal-notes/${id}`)),

  create: (payload: CreateLegalNotePayload) =>
    unwrap<LegalNote>(apiClient.post('/legal-notes', payload)),

  update: (id: string, payload: UpdateLegalNotePayload) =>
    unwrap<LegalNote>(apiClient.patch(`/legal-notes/${id}`, payload)),

  delete: (id: string) => unwrap<LegalNote>(apiClient.delete(`/legal-notes/${id}`)),
};
