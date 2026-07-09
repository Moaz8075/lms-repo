import { Injectable } from '@nestjs/common';
import { PaymentStatus, TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { DB_PAYMENT_STATUS_TO_API } from '../../common/enums';
import { DiaryService } from '../diary/diary.service';
import { DashboardResponse } from './dashboard.types';
import { decimalToNumber } from '../payments/payments.types';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly diaryService: DiaryService,
  ) {}

  async getDashboard(organizationId: string): Promise<DashboardResponse> {
    const today = new Date().toISOString().slice(0, 10);

    const [diary, pendingPayments, pendingPaymentsCount, recentCases, tasksRemaining, totalCases] =
      await Promise.all([
        this.diaryService.getDaily(organizationId, { date: today }),
        this.prisma.payment.findMany({
          where: {
            organizationId,
            isActive: true,
            status: {
              in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL, PaymentStatus.OVERDUE],
            },
          },
          include: {
            case: { select: { caseNumber: true, title: true } },
            client: { select: { firstName: true, lastName: true } },
          },
          orderBy: [{ dueDate: 'asc' }, { createdAt: 'desc' }],
          take: 5,
        }),
        this.prisma.payment.count({
          where: {
            organizationId,
            isActive: true,
            status: {
              in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL, PaymentStatus.OVERDUE],
            },
          },
        }),
        this.prisma.case.findMany({
          where: { organizationId, isActive: true },
          include: { client: { select: { firstName: true, lastName: true } } },
          orderBy: { updatedAt: 'desc' },
          take: 5,
        }),
        this.prisma.task.count({
          where: {
            organizationId,
            date: this.parseDateOnly(today),
            status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] },
          },
        }),
        this.prisma.case.count({ where: { organizationId, isActive: true } }),
      ]);

    return {
      date: today,
      stats: {
        hearingsToday: diary.hearings.length,
        tasksRemaining,
        pendingPaymentsCount,
        totalCases,
      },
      todaysHearings: diary.caseRows.map((row) => ({
        hearingId: row.hearingId,
        caseId: row.caseId,
        caseNumber: row.caseNumber,
        caseTitle: row.caseTitle,
        clientName: row.clientName,
        courtName: row.courtName,
        courtRoom: row.courtRoom,
        hearingTime: row.hearingTime,
        todayPurpose: row.todayPurpose,
      })),
      todaysTasks: diary.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        caseId: task.caseId,
        caseTitle: task.caseTitle,
        status: task.status,
        time: task.time,
      })),
      pendingPayments: pendingPayments.map((payment) => ({
        id: payment.id,
        amount: decimalToNumber(payment.amount),
        currency: payment.currency,
        status: DB_PAYMENT_STATUS_TO_API[payment.status] ?? payment.status,
        dueDate: payment.dueDate ? payment.dueDate.toISOString().slice(0, 10) : null,
        caseId: payment.caseId,
        caseNumber: payment.case.caseNumber,
        caseTitle: payment.case.title,
        clientName: payment.client
          ? `${payment.client.firstName} ${payment.client.lastName}`.trim()
          : null,
      })),
      recentCases: recentCases.map((caseRecord) => ({
        id: caseRecord.id,
        caseNumber: caseRecord.caseNumber,
        title: caseRecord.title,
        updatedAt: caseRecord.updatedAt.toISOString(),
        clientName: caseRecord.client
          ? `${caseRecord.client.firstName} ${caseRecord.client.lastName}`.trim()
          : null,
      })),
    };
  }

  private parseDateOnly(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }
}
