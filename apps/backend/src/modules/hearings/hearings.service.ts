import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType, Prisma } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateHearingDto, ListHearingsQueryDto, UpdateHearingDto } from './dto';
import {
  combineDateAndTime,
  HearingResponse,
  toHearingResponse,
} from './hearings.types';

@Injectable()
export class HearingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    organizationId: string,
    userId: string,
    dto: CreateHearingDto,
  ): Promise<HearingResponse> {
    await this.validateCase(organizationId, dto.caseId);

    const scheduledDate = combineDateAndTime(dto.hearingDate, dto.time);

    const hearing = await this.prisma.$transaction(async (tx) => {
      const created = await tx.hearing.create({
        data: {
          organizationId,
          caseId: dto.caseId,
          scheduledDate,
          courtRoom: dto.courtRoom?.trim() || null,
          purpose: dto.purpose?.trim() || null,
          notes: dto.notes?.trim() || null,
          nextHearingDate: dto.nextHearingDate
            ? new Date(`${dto.nextHearingDate}T00:00:00.000Z`)
            : null,
        },
      });

      await this.syncCaseNextHearingDate(tx, organizationId, dto.caseId);

      return created;
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.CREATE,
      entityType: 'Hearing',
      entityId: hearing.id,
      description: `Hearing scheduled for case on ${dto.hearingDate} at ${dto.time}`,
      metadata: {
        caseId: dto.caseId,
        scheduledDate: hearing.scheduledDate,
      },
    });

    return toHearingResponse(hearing);
  }

  async findAll(
    organizationId: string,
    query: ListHearingsQueryDto,
  ): Promise<PaginatedResult<HearingResponse>> {
    await this.validateCase(organizationId, query.caseId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { organizationId, caseId: query.caseId };

    const [hearings, total] = await Promise.all([
      this.prisma.hearing.findMany({
        where,
        orderBy: { scheduledDate: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.hearing.count({ where }),
    ]);

    return {
      items: hearings.map(toHearingResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async update(
    organizationId: string,
    userId: string,
    hearingId: string,
    dto: UpdateHearingDto,
  ): Promise<HearingResponse> {
    const hearing = await this.findHearingOrThrow(organizationId, hearingId);

    const scheduledDate =
      dto.hearingDate && dto.time
        ? combineDateAndTime(dto.hearingDate, dto.time)
        : dto.hearingDate
          ? combineDateAndTime(
              dto.hearingDate,
              extractTimeFromDate(hearing.scheduledDate),
            )
          : dto.time
            ? combineDateAndTime(
                extractDateFromDate(hearing.scheduledDate),
                dto.time,
              )
            : undefined;

    const updated = await this.prisma.$transaction(async (tx) => {
      const record = await tx.hearing.update({
        where: { id: hearingId },
        data: {
          ...(scheduledDate && { scheduledDate }),
          ...(dto.courtRoom !== undefined && {
            courtRoom: dto.courtRoom.trim() || null,
          }),
          ...(dto.purpose !== undefined && {
            purpose: dto.purpose.trim() || null,
          }),
          ...(dto.notes !== undefined && { notes: dto.notes.trim() || null }),
          ...(dto.nextHearingDate !== undefined && {
            nextHearingDate: dto.nextHearingDate
              ? new Date(dto.nextHearingDate)
              : null,
          }),
        },
      });

      await this.syncCaseNextHearingDate(tx, organizationId, hearing.caseId);

      return record;
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.UPDATE,
      entityType: 'Hearing',
      entityId: updated.id,
      description: `Hearing updated for case`,
      metadata: {
        caseId: updated.caseId,
        scheduledDate: updated.scheduledDate,
      },
    });

    return toHearingResponse(updated);
  }

  private async validateCase(organizationId: string, caseId: string) {
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId, isActive: true },
    });

    if (!caseRecord) {
      throw new BadRequestException('Case not found in your organization');
    }
  }

  private async findHearingOrThrow(organizationId: string, hearingId: string) {
    const hearing = await this.prisma.hearing.findFirst({
      where: { id: hearingId, organizationId },
    });

    if (!hearing) {
      throw new NotFoundException('Hearing not found');
    }

    return hearing;
  }

  private async syncCaseNextHearingDate(
    tx: Prisma.TransactionClient,
    organizationId: string,
    caseId: string,
  ): Promise<void> {
    const nextHearing = await tx.hearing.findFirst({
      where: {
        organizationId,
        caseId,
        scheduledDate: { gte: new Date() },
      },
      orderBy: { scheduledDate: 'asc' },
    });

    await tx.case.update({
      where: { id: caseId },
      data: { nextHearingDate: nextHearing?.scheduledDate ?? null },
    });
  }
}

function extractDateFromDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function extractTimeFromDate(date: Date): string {
  return date.toISOString().slice(11, 16);
}
