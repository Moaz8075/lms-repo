import type { ListLegalNotesParams, ListLibraryItemsParams } from '@/types';

export const LEGAL_RESEARCH_PAGE_SIZE = 20;

export const legalResearchKeys = {
  all: ['legal-research'] as const,
  notes: {
    all: ['legal-research', 'notes'] as const,
    list: (params?: ListLegalNotesParams) =>
      ['legal-research', 'notes', 'list', params ?? {}] as const,
    detail: (id: string) => ['legal-research', 'notes', 'detail', id] as const,
  },
  library: {
    all: ['legal-research', 'library'] as const,
    list: (params?: ListLibraryItemsParams) =>
      ['legal-research', 'library', 'list', params ?? {}] as const,
    detail: (id: string) =>
      ['legal-research', 'library', 'detail', id] as const,
  },
  caseReferences: {
    all: ['legal-research', 'case-references'] as const,
    list: (caseId: string) =>
      ['legal-research', 'case-references', caseId] as const,
  },
};
