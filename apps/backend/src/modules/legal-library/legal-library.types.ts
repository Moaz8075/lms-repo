import { LibraryItem } from '@prisma/client';

export interface LibraryItemResponse {
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

export function toLibraryItemResponse(item: LibraryItem): LibraryItemResponse {
  return {
    id: item.id,
    organizationId: item.organizationId,
    title: item.title,
    citation: item.citation,
    court: item.court,
    jurisdiction: item.jurisdiction,
    year: item.year,
    category: item.category,
    author: item.author,
    pdfUrl: item.pdfUrl,
    totalPages: item.totalPages,
    description: item.description,
    tags: item.tags,
    isSystemDocument: item.isSystemDocument,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  };
}
