export interface LibraryItem {
  id: string;
  organizationId: string | null;
  title: string;
  citation: string | null;
  court: string | null;
  jurisdiction: string | null;
  year: number | null;
  category: string | null;
  author: string | null;
  pdfUrl: string;
  totalPages: number;
  description: string | null;
  tags: string[];
  isSystemDocument: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListLibraryItemsParams {
  page?: number;
  limit?: number;
  keyword?: string;
  tag?: string;
  court?: string;
  citation?: string;
  category?: string;
}

export interface CreateLibraryItemPayload {
  title: string;
  pdfUrl: string;
  citation?: string;
  court?: string;
  jurisdiction?: string;
  year?: number;
  category?: string;
  author?: string;
  totalPages?: number;
  description?: string;
  tags?: string[];
}

export interface LegalNoteCreator {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LegalNoteLibrarySummary {
  id: string;
  title: string;
  pdfUrl: string;
  citation: string | null;
}

export interface LegalNote {
  id: string;
  organizationId: string;
  createdBy: LegalNoteCreator;
  libraryItem: LegalNoteLibrarySummary | null;
  pageNumber: number;
  selectedText: string;
  personalNote: string | null;
  title: string;
  citation: string | null;
  court: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListLegalNotesParams {
  page?: number;
  limit?: number;
  keyword?: string;
  tag?: string;
  court?: string;
  citation?: string;
  libraryItemId?: string;
}

export interface CreateLegalNotePayload {
  title: string;
  pageNumber: number;
  selectedText: string;
  personalNote?: string;
  libraryItemId?: string;
  citation?: string;
  court?: string;
  tags?: string[];
}

export interface UpdateLegalNotePayload {
  title?: string;
  personalNote?: string;
  tags?: string[];
}

export interface CaseReference {
  id: string;
  caseId: string;
  legalNote: LegalNote;
  attachedBy: LegalNoteCreator;
  attachedAt: string;
}

export interface AttachCaseReferencePayload {
  legalNoteId: string;
}

export const LIBRARY_CATEGORIES = [
  'All',
  'Judgment',
  'Book',
  'Statute',
  'Article',
] as const;

export type LibraryCategory = (typeof LIBRARY_CATEGORIES)[number];
