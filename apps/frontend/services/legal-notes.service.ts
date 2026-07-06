import { api, unwrap } from './api';
import type {
  CreateLegalNotePayload,
  LegalNote,
  ListLegalNotesParams,
  PaginatedResult,
  UpdateLegalNotePayload,
} from '@/types';

export const legalNotesService = {
  list: (params?: ListLegalNotesParams) =>
    unwrap<PaginatedResult<LegalNote>>(api.get('/legal-notes', { params })),

  getById: (id: string) => unwrap<LegalNote>(api.get(`/legal-notes/${id}`)),

  create: (payload: CreateLegalNotePayload) =>
    unwrap<LegalNote>(api.post('/legal-notes', payload)),

  update: (id: string, payload: UpdateLegalNotePayload) =>
    unwrap<LegalNote>(api.patch(`/legal-notes/${id}`, payload)),

  delete: (id: string) => unwrap<LegalNote>(api.delete(`/legal-notes/${id}`)),
};
