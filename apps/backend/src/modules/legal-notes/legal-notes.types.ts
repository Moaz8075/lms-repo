import { LegalNote, LibraryItem, User } from '@prisma/client';

type LegalNoteWithRelations = LegalNote & {
  createdBy?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
  libraryItem?: Pick<LibraryItem, 'id' | 'title' | 'pdfUrl' | 'citation'> | null;
};

export interface LegalNoteCreatorSummary {
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

export interface LegalNoteResponse {
  id: string;
  organizationId: string;
  createdBy: LegalNoteCreatorSummary;
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

export interface CaseReferenceResponse {
  id: string;
  caseId: string;
  legalNote: LegalNoteResponse;
  attachedBy: LegalNoteCreatorSummary;
  attachedAt: string;
}

export function toLegalNoteResponse(note: LegalNoteWithRelations): LegalNoteResponse {
  if (!note.createdBy) {
    throw new Error('Legal note creator relation is required');
  }

  return {
    id: note.id,
    organizationId: note.organizationId,
    createdBy: {
      id: note.createdBy.id,
      firstName: note.createdBy.firstName,
      lastName: note.createdBy.lastName,
      email: note.createdBy.email,
    },
    libraryItem: note.libraryItem
      ? {
          id: note.libraryItem.id,
          title: note.libraryItem.title,
          pdfUrl: note.libraryItem.pdfUrl,
          citation: note.libraryItem.citation,
        }
      : null,
    pageNumber: note.pageNumber,
    selectedText: note.selectedText,
    personalNote: note.personalNote,
    title: note.title,
    citation: note.citation,
    court: note.court,
    tags: note.tags,
    createdAt: note.createdAt.toISOString(),
    updatedAt: note.updatedAt.toISOString(),
  };
}

export function toCaseReferenceResponse(
  reference: {
    id: string;
    caseId: string;
    attachedAt: Date;
    attachedBy: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'>;
    legalNote: LegalNoteWithRelations;
  },
): CaseReferenceResponse {
  return {
    id: reference.id,
    caseId: reference.caseId,
    legalNote: toLegalNoteResponse(reference.legalNote),
    attachedBy: {
      id: reference.attachedBy.id,
      firstName: reference.attachedBy.firstName,
      lastName: reference.attachedBy.lastName,
      email: reference.attachedBy.email,
    },
    attachedAt: reference.attachedAt.toISOString(),
  };
}
