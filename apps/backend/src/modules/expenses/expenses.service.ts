import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType, Prisma } from '@prisma/client';
import { API_EXPENSE_CATEGORY_TO_DB } from '../../common/enums';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityLogsService } from '../activity-logs/activity-logs.service';
import { CreateExpenseDto, ListExpensesQueryDto, UpdateExpenseDto } from './dto';
import {
  CaseExpenseSummary,
  decimalToNumber,
  ExpenseResponse,
  ListExpensesResponse,
  toExpenseResponse,
} from './expenses.types';

const recorderInclude = { recordedBy: true } as const;

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activityLogsService: ActivityLogsService,
  ) {}

  async create(
    organizationId: string,
    userId: string,
    dto: CreateExpenseDto,
  ): Promise<ExpenseResponse> {
    await this.validateCase(organizationId, dto.caseId);

    const expense = await this.prisma.expense.create({
      data: {
        organizationId,
        caseId: dto.caseId,
        recordedById: userId,
        amount: new Prisma.Decimal(dto.amount),
        currency: 'PKR',
        category: API_EXPENSE_CATEGORY_TO_DB[dto.category],
        description: dto.description?.trim() || null,
        expenseDate: new Date(dto.expenseDate),
      },
      include: recorderInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.CREATE,
      entityType: 'Expense',
      entityId: expense.id,
      description: `Expense of ${dto.amount} PKR recorded for case`,
      metadata: {
        caseId: dto.caseId,
        amount: dto.amount,
        category: dto.category,
      },
    });

    return toExpenseResponse(expense);
  }

  async findAll(
    organizationId: string,
    query: ListExpensesQueryDto,
  ): Promise<ListExpensesResponse> {
    await this.validateCase(organizationId, query.caseId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      organizationId,
      caseId: query.caseId,
    };

    const [expenses, total, summary] = await Promise.all([
      this.prisma.expense.findMany({
        where,
        include: recorderInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.expense.count({ where }),
      this.buildCaseExpenseSummary(organizationId, query.caseId),
    ]);

    return {
      items: expenses.map(toExpenseResponse),
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
    expenseId: string,
    dto: UpdateExpenseDto,
  ): Promise<ExpenseResponse> {
    const expense = await this.findExpenseOrThrow(organizationId, expenseId);

    const updated = await this.prisma.expense.update({
      where: { id: expenseId },
      data: {
        ...(dto.amount !== undefined && {
          amount: new Prisma.Decimal(dto.amount),
        }),
        ...(dto.category && {
          category: API_EXPENSE_CATEGORY_TO_DB[dto.category],
        }),
        ...(dto.expenseDate && {
          expenseDate: new Date(dto.expenseDate),
        }),
        ...(dto.description !== undefined && {
          description: dto.description.trim() || null,
        }),
      },
      include: recorderInclude,
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.UPDATE,
      entityType: 'Expense',
      entityId: updated.id,
      description: `Expense updated for case`,
      metadata: {
        caseId: expense.caseId,
        amount: decimalToNumber(updated.amount),
        category: updated.category,
      },
    });

    return toExpenseResponse(updated);
  }

  async remove(
    organizationId: string,
    userId: string,
    expenseId: string,
  ): Promise<ExpenseResponse> {
    const expense = await this.findExpenseOrThrow(organizationId, expenseId);

    await this.prisma.expense.delete({
      where: { id: expenseId },
    });

    await this.activityLogsService.log({
      organizationId,
      userId,
      activityType: ActivityType.DELETE,
      entityType: 'Expense',
      entityId: expense.id,
      description: `Expense of ${decimalToNumber(expense.amount)} PKR deleted`,
      metadata: {
        caseId: expense.caseId,
      },
    });

    return toExpenseResponse(expense);
  }

  private async buildCaseExpenseSummary(
    organizationId: string,
    caseId: string,
  ): Promise<CaseExpenseSummary> {
    const aggregates = await this.prisma.expense.aggregate({
      where: { organizationId, caseId },
      _sum: { amount: true },
      _count: { id: true },
    });

    return {
      total: decimalToNumber(aggregates._sum.amount ?? 0),
      count: aggregates._count.id,
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

  private async findExpenseOrThrow(organizationId: string, expenseId: string) {
    const expense = await this.prisma.expense.findFirst({
      where: { id: expenseId, organizationId },
      include: recorderInclude,
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }
}
