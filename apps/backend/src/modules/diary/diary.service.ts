import { Injectable } from '@nestjs/common';
import { Case, Client, Hearing, Task, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { extractDateAndTime } from '../hearings/hearings.types';
import {
  DailyDiaryResponse,
  DiaryCaseRow,
  TimelineItem,
  UpcomingDateGroup,
  UpcomingDiaryResponse,
} from './diary.types';
import { DiaryQueryDto, UpcomingDiaryQueryDto } from './dto';

type HearingWithCase = Hearing & { case: Case };
type HearingWithCaseClient = Hearing & { case: Case & { client: Client } };
type TaskWithCase = Task & { case: Case | null };

const UPCOMING_DEFAULT_DAYS = 30;

@Injectable()
export class DiaryService {
  constructor(private readonly prisma: PrismaService) {}

  async getDaily(
    organizationId: string,
    query: DiaryQueryDto,
  ): Promise<DailyDiaryResponse> {
    const dateStr = query.date.slice(0, 10);
    const { dayStart, dayEnd } = this.dayBounds(dateStr);

    const caseFilter = query.caseId ? { caseId: query.caseId } : {};

    const [hearings, tasks] = await Promise.all([
      this.prisma.hearing.findMany({
        where: {
          organizationId,
          scheduledDate: { gte: dayStart, lte: dayEnd },
          case: { isActive: true },
          ...caseFilter,
        },
        include: { case: { include: { client: true } } },
        orderBy: { scheduledDate: 'asc' },
      }),
      this.prisma.task.findMany({
        where: {
          organizationId,
          date: { gte: dayStart, lte: dayEnd },
          status: { not: TaskStatus.CANCELLED },
          ...(query.caseId ? { caseId: query.caseId } : {}),
        },
        include: { case: true },
        orderBy: [{ time: 'asc' }, { createdAt: 'asc' }],
      }),
    ]);

    const caseIds = [...new Set(hearings.map((h) => h.caseId))];
    const [futureHearings, pastHearings] = await Promise.all([
      caseIds.length > 0
        ? this.prisma.hearing.findMany({
            where: {
              organizationId,
              caseId: { in: caseIds },
              scheduledDate: { gt: dayEnd },
            },
            orderBy: { scheduledDate: 'asc' },
          })
        : Promise.resolve([]),
      caseIds.length > 0
        ? this.prisma.hearing.findMany({
            where: {
              organizationId,
              caseId: { in: caseIds },
              scheduledDate: { lt: dayStart },
            },
            orderBy: { scheduledDate: 'desc' },
          })
        : Promise.resolve([]),
    ]);

    const lastHearingByCase = new Map<string, string>();
    for (const h of pastHearings) {
      if (!lastHearingByCase.has(h.caseId)) {
        lastHearingByCase.set(h.caseId, this.toDateString(h.scheduledDate));
      }
    }

    const hearingItems = hearings.map((h) =>
      this.fromHearing(h, lastHearingByCase.get(h.caseId) ?? null),
    );
    const taskItems = tasks.map((t) => this.fromTask(t));
    const combinedTimeline = this.sortTimeline([...hearingItems, ...taskItems]);

    const caseRows = this.buildCaseRows(
      hearings as HearingWithCaseClient[],
      futureHearings,
    );

    return {
      date: dateStr,
      hearings: hearingItems,
      tasks: taskItems,
      combinedTimeline,
      caseRows,
      totalCases: caseRows.length,
    };
  }

  async getUpcoming(
    organizationId: string,
    query: UpcomingDiaryQueryDto,
  ): Promise<UpcomingDiaryResponse> {
    const days = query.days ?? UPCOMING_DEFAULT_DAYS;
    const todayStr = this.toDateString(new Date());
    const rangeStart = this.dayBounds(todayStr).dayStart;
    const rangeEnd = new Date(rangeStart);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + days);
    rangeEnd.setUTCHours(23, 59, 59, 999);

    const caseFilter = query.caseId ? { caseId: query.caseId } : {};

    const [hearings, tasks] = await Promise.all([
      this.prisma.hearing.findMany({
        where: {
          organizationId,
          scheduledDate: { gte: rangeStart, lte: rangeEnd },
          case: { isActive: true },
          ...caseFilter,
        },
        include: { case: true },
        orderBy: { scheduledDate: 'asc' },
      }),
      this.prisma.task.findMany({
        where: {
          organizationId,
          date: { gte: rangeStart, lte: rangeEnd },
          status: { not: TaskStatus.CANCELLED },
          ...(query.caseId ? { caseId: query.caseId } : {}),
        },
        include: { case: true },
        orderBy: [{ date: 'asc' }, { time: 'asc' }, { createdAt: 'asc' }],
      }),
    ]);

    const itemsWithDate: { date: string; item: TimelineItem }[] = [
      ...hearings.map((h) => ({
        date: extractDateAndTime(h.scheduledDate).hearingDate,
        item: this.fromHearing(h),
      })),
      ...tasks.map((t) => ({
        date: this.toDateString(t.date),
        item: this.fromTask(t),
      })),
    ];

    const byDate = new Map<string, TimelineItem[]>();
    for (const { date, item } of itemsWithDate) {
      if (!byDate.has(date)) byDate.set(date, []);
      byDate.get(date)!.push(item);
    }

    const groups: UpcomingDateGroup[] = [...byDate.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, groupItems]) => ({
        date,
        label: this.formatDateLabel(date),
        items: this.sortTimeline(groupItems),
      }));

    return { groups };
  }

  private buildCaseRows(
    hearingsToday: HearingWithCaseClient[],
    futureHearings: Hearing[],
  ): DiaryCaseRow[] {
    const futureByCase = new Map<string, Hearing[]>();
    for (const hearing of futureHearings) {
      if (!futureByCase.has(hearing.caseId)) {
        futureByCase.set(hearing.caseId, []);
      }
      futureByCase.get(hearing.caseId)!.push(hearing);
    }

    return hearingsToday.map((hearing) => {
      const { time } = extractDateAndTime(hearing.scheduledDate);
      const client = hearing.case.client;
      const clientName = `${client.firstName} ${client.lastName}`.trim();

      let nextHearingDate: string | null = null;
      let nextHearingPurpose: string | null = null;

      if (hearing.nextHearingDate) {
        nextHearingDate = this.toDateString(hearing.nextHearingDate);
        const matched = futureByCase
          .get(hearing.caseId)
          ?.find(
            (h) =>
              this.toDateString(h.scheduledDate) === nextHearingDate,
          );
        nextHearingPurpose = matched?.purpose ?? null;
      }

      if (!nextHearingDate) {
        const next = futureByCase.get(hearing.caseId)?.[0];
        if (next) {
          nextHearingDate = this.toDateString(next.scheduledDate);
          nextHearingPurpose = next.purpose;
        }
      }

      return {
        hearingId: hearing.id,
        caseId: hearing.caseId,
        caseNumber: hearing.case.caseNumber,
        caseTitle: hearing.case.title,
        clientName,
        courtName: hearing.case.courtName,
        courtRoom: hearing.courtRoom,
        hearingTime: time,
        todayPurpose: hearing.purpose,
        nextHearingDate,
        nextHearingPurpose,
      };
    });
  }

  private fromHearing(
    hearing: HearingWithCase,
    lastHearingDate: string | null = null,
  ): TimelineItem {
    const { time } = extractDateAndTime(hearing.scheduledDate);

    return {
      id: hearing.id,
      type: 'HEARING',
      title: hearing.purpose?.trim() || hearing.case.title,
      caseId: hearing.caseId,
      caseTitle: hearing.case.title,
      courtName: hearing.case.courtName,
      time,
      description: hearing.notes ?? hearing.purpose,
      status: 'SCHEDULED',
      lastHearingDate,
    };
  }

  private fromTask(task: TaskWithCase): TimelineItem {
    return {
      id: task.id,
      type: 'TASK',
      title: task.title,
      caseId: task.caseId,
      caseTitle: task.case?.title ?? null,
      courtName: task.case?.courtName ?? null,
      time: task.time,
      description: task.description,
      status: task.status,
      taskType: task.type,
    };
  }

  private sortTimeline(items: TimelineItem[]): TimelineItem[] {
    return [...items].sort((a, b) => {
      const timeA = a.time ?? '99:99';
      const timeB = b.time ?? '99:99';
      return timeA.localeCompare(timeB);
    });
  }

  private dayBounds(dateStr: string): { dayStart: Date; dayEnd: Date } {
    return {
      dayStart: new Date(`${dateStr}T00:00:00.000Z`),
      dayEnd: new Date(`${dateStr}T23:59:59.999Z`),
    };
  }

  private toDateString(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private formatDateLabel(dateStr: string): string {
    const date = new Date(`${dateStr}T12:00:00.000Z`);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
    });
  }
}
