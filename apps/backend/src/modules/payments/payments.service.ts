import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType, PaymentStatus, Prisma } from '@prisma/client';
import {
  API_PAYMENT_METHOD_TO_DB,
  API_PAYMENT_STATUS_TO_DB,
} from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreatePaymentDto, ListPaymentsQueryDto, UpdatePaymentDto } from './dto';
import {
  CasePaymentSummary,
  decimalToNumber,
  ListPaymentsResponse,
  PaymentResponse,
  toPaymentResponse,
} from './payments.types';

const recorderInclude = { recordedBy: true } as const;

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    organizationId: string,
    userId: string,
    dto: CreatePaymentDto,
  ): Promise<PaymentResponse> {
    const caseRecord = await this.validateCase(organizationId, dto.caseId);

    const dbStatus = API_PAYMENT_STATUS_TO_DB[dto.status];
    const dbMethod = API_PAYMENT_METHOD_TO_DB[dto.paymentMethod];

    const payment = await this.prisma.payment.create({
      data: {
        organizationId,
        caseId: dto.caseId,
        clientId: caseRecord.clientId,
        recordedById: userId,
        amount: new Prisma.Decimal(dto.amount),
        currency: 'PKR',
        status: dbStatus,
        method: dbMethod,
        description: dto.notes?.trim() || null,
        paidDate: dbStatus === PaymentStatus.PAID ? new Date() : null,
        isActive: true,
      },
      include: recorderInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.PAYMENT_RECORDED,
      entityType: 'Payment',
      entityId: payment.id,
      description: `Payment of ${dto.amount} PKR recorded for case`,
      metadata: {
        caseId: dto.caseId,
        amount: dto.amount,
        status: dto.status,
        paymentMethod: dto.paymentMethod,
      },
    });

    return toPaymentResponse(payment);
  }

  async findAll(
    organizationId: string,
    query: ListPaymentsQueryDto,
  ): Promise<ListPaymentsResponse> {
    await this.validateCase(organizationId, query.caseId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      organizationId,
      caseId: query.caseId,
      isActive: true,
    };

    const [payments, total, summary] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: recorderInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
      this.buildCasePaymentSummary(organizationId, query.caseId),
    ]);

    return {
      items: payments.map(toPaymentResponse),
      summary,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async update(
    organizationId: string,
    userId: string,
    paymentId: string,
    dto: UpdatePaymentDto,
  ): Promise<PaymentResponse> {
    const payment = await this.findPaymentOrThrow(organizationId, paymentId);

    if (!payment.isActive) {
      throw new BadRequestException('Cannot update a deleted payment');
    }

    const dbStatus = dto.status
      ? API_PAYMENT_STATUS_TO_DB[dto.status]
      : undefined;
    const dbMethod = dto.paymentMethod
      ? API_PAYMENT_METHOD_TO_DB[dto.paymentMethod]
      : undefined;

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        ...(dto.amount !== undefined && {
          amount: new Prisma.Decimal(dto.amount),
        }),
        ...(dbMethod && { method: dbMethod }),
        ...(dbStatus && {
          status: dbStatus,
          paidDate:
            dbStatus === PaymentStatus.PAID
              ? payment.paidDate ?? new Date()
              : dbStatus === PaymentStatus.PENDING
                ? null
                : payment.paidDate,
        }),
        ...(dto.notes !== undefined && {
          description: dto.notes.trim() || null,
        }),
      },
      include: recorderInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.UPDATE,
      entityType: 'Payment',
      entityId: updated.id,
      description: `Payment updated for case`,
      metadata: {
        caseId: updated.caseId,
        amount: decimalToNumber(updated.amount),
        status: updated.status,
      },
    });

    return toPaymentResponse(updated);
  }

  async remove(
    organizationId: string,
    userId: string,
    paymentId: string,
  ): Promise<PaymentResponse> {
    const payment = await this.findPaymentOrThrow(organizationId, paymentId);

    if (!payment.isActive) {
      throw new BadRequestException('Payment is already deleted');
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { isActive: false },
      include: recorderInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.DELETE,
      entityType: 'Payment',
      entityId: updated.id,
      description: `Payment of ${decimalToNumber(updated.amount)} PKR deleted`,
      metadata: {
        caseId: updated.caseId,
      },
    });

    return toPaymentResponse(updated);
  }

  private async buildCasePaymentSummary(
    organizationId: string,
    caseId: string,
  ): Promise<CasePaymentSummary> {
    const [aggregates, caseRecord] = await Promise.all([
      this.prisma.payment.groupBy({
        by: ['status'],
        where: { organizationId, caseId, isActive: true },
        _sum: { amount: true },
      }),
      this.prisma.case.findFirst({
        where: { id: caseId, organizationId },
        select: { metadata: true },
      }),
    ]);

    let totalPaid = 0;
    let totalPending = 0;
    let totalPartial = 0;

    for (const row of aggregates) {
      const amount = decimalToNumber(row._sum.amount);
      if (row.status === PaymentStatus.PAID) totalPaid += amount;
      else if (row.status === PaymentStatus.PENDING) totalPending += amount;
      else if (row.status === PaymentStatus.PARTIAL) totalPartial += amount;
    }

    const metadata = caseRecord?.metadata as Record<string, unknown> | null;
    const agreedAmount =
      typeof metadata?.agreedFee === 'number' ? metadata.agreedFee : null;

    const remainingBalance =
      agreedAmount != null
        ? Math.max(agreedAmount - totalPaid - totalPartial, 0)
        : null;

    return {
      totalPaid,
      totalPending,
      totalPartial,
      agreedAmount,
      remainingBalance,
    };
  }

  private async validateCase(organizationId: string, caseId: string) {
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId, isActive: true },
    });

    if (!caseRecord) {
      throw new BadRequestException('Case not found in your organization');
    }

    return caseRecord;
  }

  private async findPaymentOrThrow(organizationId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id: paymentId, organizationId },
      include: recorderInclude,
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }
}
