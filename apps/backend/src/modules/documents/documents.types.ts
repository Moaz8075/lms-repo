import { Document, User } from '@prisma/client';
import { DB_ROLE_TO_API } from '../../common/enums';

export interface UploaderSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface DocumentResponse {
  id: string;
  organizationId: string;
  caseId: string;
  uploadedById: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  category: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  uploadedBy?: UploaderSummary;
}

type DocumentWithUploader = Document & { uploadedBy?: User };

export function toUploaderSummary(user: User): UploaderSummary {
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    role: DB_ROLE_TO_API[user.role] ?? user.role,
  };
}

export function toDocumentResponse(
  document: DocumentWithUploader,
  fileUrl: string,
): DocumentResponse {
  return {
    id: document.id,
    organizationId: document.organizationId,
    caseId: document.caseId,
    uploadedById: document.uploadedById,
    fileName: document.fileName,
    fileUrl,
    fileType: document.fileType,
    mimeType: document.mimeType,
    fileSize: document.fileSize,
    category: document.category,
    isActive: document.isActive,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
    ...(document.uploadedBy && {
      uploadedBy: toUploaderSummary(document.uploadedBy),
    }),
  };
}
