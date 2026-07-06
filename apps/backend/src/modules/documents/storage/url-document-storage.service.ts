import { Injectable } from '@nestjs/common';
import {
  DocumentStorageProvider,
  StoredDocumentReference,
} from './document-storage.interface';

/**
 * Temporary storage provider that persists external URLs as storage keys.
 * Replace with S3DocumentStorageService when cloud storage is integrated.
 */
@Injectable()
export class UrlDocumentStorageService implements DocumentStorageProvider {
  async storeFromUrl(fileUrl: string): Promise<StoredDocumentReference> {
    return {
      storageKey: fileUrl,
      fileUrl,
    };
  }

  async resolveFileUrl(storageKey: string): Promise<string> {
    return storageKey;
  }
}
