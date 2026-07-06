export interface StoredDocumentReference {
  storageKey: string;
  fileUrl: string;
}

/**
 * Abstraction for document storage backends (URL today, S3/Cloud later).
 */
export interface DocumentStorageProvider {
  storeFromUrl(fileUrl: string): Promise<StoredDocumentReference>;
  resolveFileUrl(storageKey: string): Promise<string>;
}

export const DOCUMENT_STORAGE = Symbol('DOCUMENT_STORAGE');
