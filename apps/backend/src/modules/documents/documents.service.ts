import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType } from '@prisma/client';
import {
  DOCUMENT_FILE_TYPE_MIME,
  DocumentFileType,
} from '../../common/enums';
import { PaginatedResult } from '../../common/interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { ListDocumentsQueryDto, UploadDocumentDto } from './dto';
import { DocumentResponse, toDocumentResponse } from './documents.types';
import {
  DOCUMENT_STORAGE,
  DocumentStorageProvider,
} from './storage/document-storage.interface';

const uploaderInclude = { uploadedBy: true } as const;

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: ActivityLogsService,
    @Inject(DOCUMENT_STORAGE)
    private readonly storageProvider: DocumentStorageProvider,
  ) {}

  async upload(
    organizationId: string,
    userId: string,
    dto: UploadDocumentDto,
  ): Promise<DocumentResponse> {
    await this.validateCase(organizationId, dto.caseId);

    const stored = await this.storageProvider.storeFromUrl(dto.fileUrl);
    const mimeType = DOCUMENT_FILE_TYPE_MIME[dto.fileType as DocumentFileType];

    const document = await this.prisma.document.create({
      data: {
        organizationId,
        caseId: dto.caseId,
        uploadedById: userId,
        fileName: dto.fileName.trim(),
        storageKey: stored.storageKey,
        fileType: dto.fileType,
        mimeType,
        fileSize: 0,
        category: dto.category?.trim() || null,
        isActive: true,
      },
      include: uploaderInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.UPLOAD,
      entityType: 'Document',
      entityId: document.id,
      description: `Document "${document.fileName}" uploaded to case`,
      metadata: {
        caseId: dto.caseId,
        fileType: document.fileType,
        category: document.category,
      },
    });

    return toDocumentResponse(document, stored.fileUrl);
  }

  async findAll(
    organizationId: string,
    query: ListDocumentsQueryDto,
  ): Promise<PaginatedResult<DocumentResponse>> {
    await this.validateCase(organizationId, query.caseId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      organizationId,
      caseId: query.caseId,
      isActive: true,
    };

    const [documents, total] = await Promise.all([
      this.prisma.document.findMany({
        where,
        include: uploaderInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.document.count({ where }),
    ]);

    const items = await Promise.all(
      documents.map(async (document) => {
        const fileUrl = await this.storageProvider.resolveFileUrl(
          document.storageKey,
        );
        return toDocumentResponse(document, fileUrl);
      }),
    );

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async remove(
    organizationId: string,
    userId: string,
    documentId: string,
  ): Promise<DocumentResponse> {
    const document = await this.findDocumentOrThrow(organizationId, documentId);

    if (!document.isActive) {
      throw new BadRequestException('Document is already deleted');
    }

    const updated = await this.prisma.document.update({
      where: { id: documentId },
      data: { isActive: false },
      include: uploaderInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.DELETE,
      entityType: 'Document',
      entityId: updated.id,
      description: `Document "${updated.fileName}" deleted from case`,
      metadata: {
        caseId: updated.caseId,
      },
    });

    const fileUrl = await this.storageProvider.resolveFileUrl(
      updated.storageKey,
    );

    return toDocumentResponse(updated, fileUrl);
  }

  private async validateCase(organizationId: string, caseId: string) {
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId, isActive: true },
    });

    if (!caseRecord) {
      throw new BadRequestException('Case not found in your organization');
    }
  }

  private async findDocumentOrThrow(
    organizationId: string,
    documentId: string,
  ) {
    const document = await this.prisma.document.findFirst({
      where: { id: documentId, organizationId },
      include: uploaderInclude,
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }
}
