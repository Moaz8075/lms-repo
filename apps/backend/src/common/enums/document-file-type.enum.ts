export enum DocumentFileType {
  PDF = 'PDF',
  IMAGE = 'IMAGE',
  DOC = 'DOC',
  OTHER = 'OTHER',
}

export const DOCUMENT_FILE_TYPE_MIME: Record<DocumentFileType, string> = {
  [DocumentFileType.PDF]: 'application/pdf',
  [DocumentFileType.IMAGE]: 'image/jpeg',
  [DocumentFileType.DOC]: 'application/msword',
  [DocumentFileType.OTHER]: 'application/octet-stream',
};
