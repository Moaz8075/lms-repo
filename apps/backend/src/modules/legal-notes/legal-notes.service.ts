import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType, Prisma } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import {
  AttachCaseReferenceDto,
  CreateLegalNoteDto,
  ListLegalNotesQueryDto,
  UpdateLegalNoteDto,
} from './dto';
import {
  CaseReferenceResponse,
  LegalNoteResponse,
  toCaseReferenceResponse,
  toLegalNoteResponse,
} from './legal-notes.types';

const noteInclude = {
  createdBy: {
    select: { id: true, firstName: true, lastName: true, email: true },
  },
  libraryItem: {
    select: { id: true, title: true, pdfUrl: true, citation: true },
  },
} as const;

const referenceInclude = {
  attachedBy: {
    select: { id: true, firstName: true, lastName: true, email: true },
  },
  legalNote: { include: noteInclude },
} as const;

@Injectable()
export class LegalNotesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    organizationId: string,
    userId: string,
    dto: CreateLegalNoteDto,
  ): Promise<LegalNoteResponse> {
    if (dto.libraryItemId) {
      await this.validateLibraryItemAccess(organizationId, dto.libraryItemId);
    }

    const note = await this.prisma.legalNote.create({
      data: {
        organizationId,
        createdById: userId,
        libraryItemId: dto.libraryItemId ?? null,
        pageNumber: dto.pageNumber,
        selectedText: dto.selectedText.trim(),
        personalNote: dto.personalNote?.trim() || null,
        title: dto.title.trim(),
        citation: dto.citation?.trim() || null,
        court: dto.court?.trim() || null,
        tags: dto.tags ?? [],
        isActive: true,
      },
      include: noteInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.CREATE,
      entityType: 'LegalNote',
      entityId: note.id,
      description: `Legal note "${note.title}" created`,
      metadata: {
        libraryItemId: note.libraryItemId,
        pageNumber: note.pageNumber,
      },
    });

    return toLegalNoteResponse(note);
  }

  async findAll(
    organizationId: string,
    query: ListLegalNotesQueryDto,
  ): Promise<PaginatedResult<LegalNoteResponse>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    if (query.keyword?.trim()) {
      return this.searchNotes(organizationId, query, page, limit, skip);
    }

    const where = this.buildNoteFilters(organizationId, query);

    const [notes, total] = await Promise.all([
      this.prisma.legalNote.findMany({
        where,
        include: noteInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.legalNote.count({ where }),
    ]);

    return {
      items: notes.map(toLegalNoteResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(organizationId: string, id: string): Promise<LegalNoteResponse> {
    const note = await this.findActiveNote(organizationId, id);
    return toLegalNoteResponse(note);
  }

  async update(
    organizationId: string,
    userId: string,
    id: string,
    dto: UpdateLegalNoteDto,
  ): Promise<LegalNoteResponse> {
    await this.findActiveNote(organizationId, id);

    const updated = await this.prisma.legalNote.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.personalNote !== undefined && {
          personalNote: dto.personalNote.trim() || null,
        }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
      },
      include: noteInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.UPDATE,
      entityType: 'LegalNote',
      entityId: id,
      description: `Legal note "${updated.title}" updated`,
    });

    return toLegalNoteResponse(updated);
  }

  async remove(
    organizationId: string,
    userId: string,
    id: string,
  ): Promise<LegalNoteResponse> {
    const note = await this.findActiveNote(organizationId, id);

    const updated = await this.prisma.legalNote.update({
      where: { id: note.id },
      data: { isActive: false },
      include: noteInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.DELETE,
      entityType: 'LegalNote',
      entityId: id,
      description: `Legal note "${note.title}" removed`,
    });

    return toLegalNoteResponse(updated);
  }

  async attachToCase(
    organizationId: string,
    userId: string,
    caseId: string,
    dto: AttachCaseReferenceDto,
  ): Promise<CaseReferenceResponse> {
    await this.validateCase(organizationId, caseId);
    await this.findActiveNote(organizationId, dto.legalNoteId);

    const existing = await this.prisma.caseReference.findFirst({
      where: {
        caseId,
        legalNoteId: dto.legalNoteId,
      },
    });

    if (existing) {
      throw new BadRequestException('This legal note is already attached to the case');
    }

    const reference = await this.prisma.caseReference.create({
      data: {
        caseId,
        legalNoteId: dto.legalNoteId,
        attachedById: userId,
      },
      include: referenceInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.CREATE,
      entityType: 'CaseReference',
      entityId: reference.id,
      description: `Legal note linked to case`,
      metadata: { caseId, legalNoteId: dto.legalNoteId },
    });

    return toCaseReferenceResponse(reference);
  }

  async listCaseReferences(
    organizationId: string,
    caseId: string,
  ): Promise<CaseReferenceResponse[]> {
    await this.validateCase(organizationId, caseId);

    const references = await this.prisma.caseReference.findMany({
      where: {
        caseId,
        legalNote: { organizationId, isActive: true },
      },
      include: referenceInclude,
      orderBy: { attachedAt: 'desc' },
    });

    return references.map(toCaseReferenceResponse);
  }

  async detachFromCase(
    organizationId: string,
    userId: string,
    caseId: string,
    referenceId: string,
  ): Promise<{ id: string }> {
    await this.validateCase(organizationId, caseId);

    const reference = await this.prisma.caseReference.findFirst({
      where: {
        id: referenceId,
        caseId,
        legalNote: { organizationId },
      },
    });

    if (!reference) {
      throw new NotFoundException('Case reference not found');
    }

    await this.prisma.caseReference.delete({ where: { id: referenceId } });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.DELETE,
      entityType: 'CaseReference',
      entityId: referenceId,
      description: `Legal note unlinked from case`,
      metadata: { caseId, legalNoteId: reference.legalNoteId },
    });

    return { id: referenceId };
  }

  private buildNoteFilters(
    organizationId: string,
    query: ListLegalNotesQueryDto,
  ): Prisma.LegalNoteWhereInput {
    return {
      organizationId,
      isActive: true,
      ...(query.libraryItemId && { libraryItemId: query.libraryItemId }),
      ...(query.court && {
        court: { contains: query.court.trim(), mode: 'insensitive' },
      }),
      ...(query.citation && {
        citation: { contains: query.citation.trim(), mode: 'insensitive' },
      }),
      ...(query.tag && { tags: { has: query.tag.trim() } }),
    };
  }

  private async searchNotes(
    organizationId: string,
    query: ListLegalNotesQueryDto,
    page: number,
    limit: number,
    skip: number,
  ): Promise<PaginatedResult<LegalNoteResponse>> {
    const keyword = query.keyword!.trim();
    const filters: Prisma.Sql[] = [
      Prisma.sql`ln.organization_id = ${organizationId}::uuid`,
      Prisma.sql`ln.is_active = true`,
      Prisma.sql`ln.search_vector @@ plainto_tsquery('english', ${keyword})`,
    ];

    if (query.libraryItemId) {
      filters.push(
        Prisma.sql`ln.library_item_id = ${query.libraryItemId}::uuid`,
      );
    }
    if (query.court) {
      filters.push(
        Prisma.sql`ln.court ILIKE ${'%' + query.court.trim() + '%'}`,
      );
    }
    if (query.citation) {
      filters.push(
        Prisma.sql`ln.citation ILIKE ${'%' + query.citation.trim() + '%'}`,
      );
    }
    if (query.tag) {
      filters.push(Prisma.sql`${query.tag.trim()} = ANY(ln.tags)`);
    }

    const whereClause = Prisma.join(filters, ' AND ');

    const countRows = await this.prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*)::bigint AS count
      FROM legal_notes ln
      WHERE ${whereClause}
    `;

    const total = Number(countRows[0]?.count ?? 0);

    const idRows = await this.prisma.$queryRaw<{ id: string }[]>`
      SELECT ln.id
      FROM legal_notes ln
      WHERE ${whereClause}
      ORDER BY ln.created_at DESC
      LIMIT ${limit}
      OFFSET ${skip}
    `;

    const ids = idRows.map((row) => row.id);

    if (ids.length === 0) {
      return { items: [], total, page, limit, totalPages: Math.ceil(total / limit) || 1 };
    }

    const notes = await this.prisma.legalNote.findMany({
      where: { id: { in: ids } },
      include: noteInclude,
    });

    const noteMap = new Map(notes.map((note) => [note.id, note]));
    const ordered = ids
      .map((id) => noteMap.get(id))
      .filter((note): note is NonNullable<typeof note> => Boolean(note));

    return {
      items: ordered.map(toLegalNoteResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  private async findActiveNote(organizationId: string, id: string) {
    const note = await this.prisma.legalNote.findFirst({
      where: { id, organizationId, isActive: true },
      include: noteInclude,
    });

    if (!note) {
      throw new NotFoundException('Legal note not found');
    }

    return note;
  }

  private async validateLibraryItemAccess(
    organizationId: string,
    libraryItemId: string,
  ) {
    const item = await this.prisma.libraryItem.findFirst({
      where: {
        id: libraryItemId,
        isActive: true,
        OR: [{ organizationId }, { isSystemDocument: true }],
      },
    });

    if (!item) {
      throw new NotFoundException('Library item not found');
    }
  }

  private async validateCase(organizationId: string, caseId: string) {
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId },
    });

    if (!caseRecord) {
      throw new NotFoundException('Case not found');
    }
  }
}
