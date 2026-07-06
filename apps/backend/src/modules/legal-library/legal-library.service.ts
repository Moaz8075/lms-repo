import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityType, Prisma } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateLibraryItemDto, ListLibraryItemsQueryDto } from './dto';
import { LibraryItemResponse, toLibraryItemResponse } from './legal-library.types';

@Injectable()
export class LegalLibraryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    organizationId: string,
    userId: string,
    dto: CreateLibraryItemDto,
  ): Promise<LibraryItemResponse> {
    const item = await this.prisma.libraryItem.create({
      data: {
        organizationId,
        title: dto.title.trim(),
        pdfUrl: dto.pdfUrl.trim(),
        citation: dto.citation?.trim() || null,
        court: dto.court?.trim() || null,
        jurisdiction: dto.jurisdiction?.trim() || null,
        year: dto.year ?? null,
        category: dto.category?.trim() || null,
        author: dto.author?.trim() || null,
        totalPages: dto.totalPages ?? 0,
        description: dto.description?.trim() || null,
        tags: dto.tags ?? [],
        isSystemDocument: false,
        isActive: true,
      },
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.CREATE,
      entityType: 'LibraryItem',
      entityId: item.id,
      description: `Library item "${item.title}" added`,
      metadata: { citation: item.citation, court: item.court },
    });

    return toLibraryItemResponse(item);
  }

  async findAll(
    organizationId: string,
    query: ListLibraryItemsQueryDto,
  ): Promise<PaginatedResult<LibraryItemResponse>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const accessFilter: Prisma.LibraryItemWhereInput = {
      isActive: true,
      OR: [{ organizationId }, { isSystemDocument: true }],
    };

    const filters: Prisma.LibraryItemWhereInput[] = [accessFilter];

    if (query.court) {
      filters.push({
        court: { contains: query.court.trim(), mode: 'insensitive' },
      });
    }
    if (query.citation) {
      filters.push({
        citation: { contains: query.citation.trim(), mode: 'insensitive' },
      });
    }
    if (query.category) {
      filters.push({
        category: { contains: query.category.trim(), mode: 'insensitive' },
      });
    }
    if (query.tag) {
      filters.push({ tags: { has: query.tag.trim() } });
    }
    if (query.keyword) {
      const keyword = query.keyword.trim();
      filters.push({
        OR: [
          { title: { contains: keyword, mode: 'insensitive' } },
          { citation: { contains: keyword, mode: 'insensitive' } },
          { description: { contains: keyword, mode: 'insensitive' } },
        ],
      });
    }

    const where: Prisma.LibraryItemWhereInput = { AND: filters };

    const [items, total] = await Promise.all([
      this.prisma.libraryItem.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.libraryItem.count({ where }),
    ]);

    return {
      items: items.map(toLibraryItemResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(organizationId: string, id: string): Promise<LibraryItemResponse> {
    const item = await this.findAccessibleItem(organizationId, id);
    return toLibraryItemResponse(item);
  }

  async remove(
    organizationId: string,
    userId: string,
    id: string,
  ): Promise<LibraryItemResponse> {
    const item = await this.findOwnedItem(organizationId, id);

    const updated = await this.prisma.libraryItem.update({
      where: { id: item.id },
      data: { isActive: false },
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.DELETE,
      entityType: 'LibraryItem',
      entityId: item.id,
      description: `Library item "${item.title}" removed`,
    });

    return toLibraryItemResponse(updated);
  }

  private async findAccessibleItem(organizationId: string, id: string) {
    const item = await this.prisma.libraryItem.findFirst({
      where: {
        id,
        isActive: true,
        OR: [{ organizationId }, { isSystemDocument: true }],
      },
    });

    if (!item) {
      throw new NotFoundException('Library item not found');
    }

    return item;
  }

  private async findOwnedItem(organizationId: string, id: string) {
    const item = await this.prisma.libraryItem.findFirst({
      where: {
        id,
        organizationId,
        isActive: true,
        isSystemDocument: false,
      },
    });

    if (!item) {
      throw new NotFoundException('Library item not found');
    }

    return item;
  }
}
