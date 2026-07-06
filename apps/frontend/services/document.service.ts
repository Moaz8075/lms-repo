import { api, unwrap } from './api';
import type {
  CaseScopedParams,
  Document,
  PaginatedResult,
  UploadDocumentPayload,
} from '@/types';

export const documentService = {
  list: (params: CaseScopedParams) =>
    unwrap<PaginatedResult<Document>>(api.get('/documents', { params })),

  upload: (payload: UploadDocumentPayload) =>
    unwrap<Document>(api.post('/documents', payload)),

  delete: (id: string) => unwrap<void>(api.delete(`/documents/${id}`)),
};
