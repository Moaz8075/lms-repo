import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CaseStatus, CaseType, PaymentStatus, Prisma, UserRole } from '@prisma/client';
import { PaginatedResult, AuthenticatedUser } from '../../common/interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCaseDto, ListCasesQueryDto, UpdateCaseDto } from './dto';
import {
  CaseDetailResponse,
  CaseResponse,
  decimalToNumber,
  toCaseResponse,
} from './cases.types';

const caseListInclude = {
  client: true,
  assignedLawyer: true,
} satisfies Prisma.CaseInclude;

@Injectable()
export class CasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    organizationId: string,
    userId: string,
    dto: CreateCaseDto,
  ): Promise<CaseResponse> {
    const client = await this.prisma.client.findFirst({
      where: { id: dto.clientId, organizationId, isActive: true },
    });

    if (!client) {
      throw new BadRequestException('Client not found in your organization');
    }

    if (dto.assignedLawyerId) {
      await this.validateLawyer(organizationId, dto.assignedLawyerId);
    }

    const caseNumber = dto.caseNumber?.trim()
      ? dto.caseNumber.trim()
      : await this.generateCaseNumber(organizationId);

    await this.ensureUniqueCaseNumber(organizationId, caseNumber);

    const clientName = `${client.firstName} ${client.lastName}`.trim();
    const opponent = dto.opponentParty.trim();
    const title = dto.title?.trim() || `${clientName} vs ${opponent}`;

    const caseRecord = await this.prisma.case.create({
      data: {
        organizationId,
        clientId: dto.clientId,
        assignedLawyerId: dto.assignedLawyerId,
        createdById: userId,
        caseNumber,
        title,
        caseType: dto.caseType ?? CaseType.CIVIL,
        status: CaseStatus.OPEN,
        courtName: dto.courtName?.trim() || null,
        opposingParty: opponent,
        opposingLawyer: dto.opponentLawyer?.trim() || null,
        filedDate: dto.filingDate ? new Date(dto.filingDate) : null,
        isActive: true,
      },
      include: caseListInclude,
    });

    return toCaseResponse(caseRecord);
  }

  async findAll(
    organizationId: string,
    query: ListCasesQueryDto,
  ): Promise<PaginatedResult<CaseResponse>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = this.buildListWhere(organizationId, query);

    const [cases, total] = await Promise.all([
      this.prisma.case.findMany({
        where,
        include: caseListInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.case.count({ where }),
    ]);

    return {
      items: cases.map(toCaseResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(
    organizationId: string,
    caseId: string,
  ): Promise<CaseDetailResponse> {
    const caseRecord = await this.findCaseOrThrow(organizationId, caseId);

    const [
      hearingsCount,
      documentsCount,
      paymentAggregates,
      expenseAggregates,
      nextHearing,
    ] = await Promise.all([
      this.prisma.hearing.count({
        where: { organizationId, caseId },
      }),
      this.prisma.document.count({
        where: { organizationId, caseId },
      }),
      this.prisma.payment.groupBy({
        by: ['status'],
        where: { organizationId, caseId },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.expense.aggregate({
        where: { organizationId, caseId },
        _sum: { amount: true },
        _count: { id: true },
      }),
      this.prisma.hearing.findFirst({
        where: {
          organizationId,
          caseId,
          scheduledDate: { gte: new Date() },
        },
        orderBy: { scheduledDate: 'asc' },
        select: { scheduledDate: true, nextHearingDate: true },
      }),
    ]);

    const paymentsSummary = this.buildPaymentsSummary(paymentAggregates);
    const expensesSummary = {
      total: decimalToNumber(expenseAggregates._sum.amount ?? 0),
      count: expenseAggregates._count.id,
    };

    const nextHearingDate =
      caseRecord.nextHearingDate ??
      nextHearing?.nextHearingDate ??
      nextHearing?.scheduledDate ??
      null;

    const base = toCaseResponse({
      ...caseRecord,
      nextHearingDate,
    });

    return {
      ...base,
      description: caseRecord.description,
      hearingsCount,
      documentsCount,
      paymentsSummary,
      expensesSummary,
    };
  }

  async update(
    organizationId: string,
    user: AuthenticatedUser,
    caseId: string,
    dto: UpdateCaseDto,
  ): Promise<CaseResponse> {
    const caseRecord = await this.findCaseOrThrow(organizationId, caseId);

    this.assertCanEditCase(user, caseRecord);

    if (!caseRecord.isActive) {
      throw new BadRequestException('Cannot update a deactivated case');
    }

    if (dto.assignedLawyerId) {
      await this.validateLawyer(organizationId, dto.assignedLawyerId);
    }

    if (dto.caseNumber && dto.caseNumber !== caseRecord.caseNumber) {
      await this.ensureUniqueCaseNumber(organizationId, dto.caseNumber, caseId);
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        ...(dto.caseNumber !== undefined && { caseNumber: dto.caseNumber.trim() }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.courtName !== undefined && {
          courtName: dto.courtName.trim() || null,
        }),
        ...(dto.caseType !== undefined && { caseType: dto.caseType }),
        ...(dto.opponentParty !== undefined && {
          opposingParty: dto.opponentParty.trim() || null,
        }),
        ...(dto.opponentLawyer !== undefined && {
          opposingLawyer: dto.opponentLawyer.trim() || null,
        }),
        ...(dto.assignedLawyerId !== undefined && {
          assignedLawyerId: dto.assignedLawyerId || null,
        }),
        ...(dto.filingDate !== undefined && {
          filedDate: dto.filingDate ? new Date(dto.filingDate) : null,
        }),
        ...(dto.description !== undefined && {
          description: dto.description.trim() || null,
        }),
        updatedById: user.id,
        ...(dto.status === CaseStatus.CLOSED && {
          closedDate: new Date(),
        }),
      },
      include: caseListInclude,
    });

    return toCaseResponse(updated);
  }

  async remove(
    organizationId: string,
    user: AuthenticatedUser,
    caseId: string,
  ): Promise<CaseResponse> {
    const caseRecord = await this.findCaseOrThrow(organizationId, caseId);

    this.assertCanEditCase(user, caseRecord);

    if (!caseRecord.isActive) {
      throw new BadRequestException('Case is already deactivated');
    }

    const updated = await this.prisma.case.update({
      where: { id: caseId },
      data: {
        isActive: false,
        status: CaseStatus.ARCHIVED,
        updatedById: user.id,
      },
      include: caseListInclude,
    });

    return toCaseResponse(updated);
  }

  private buildListWhere(
    organizationId: string,
    query: ListCasesQueryDto,
  ): Prisma.CaseWhereInput {
    const where: Prisma.CaseWhereInput = {
      organizationId,
      isActive: true,
    };

    const andConditions: Prisma.CaseWhereInput[] = [];

    if (query.status) {
      where.status = query.status;
    }

    if (query.clientId) {
      where.clientId = query.clientId;
    }

    if (query.courtName) {
      andConditions.push({
        courtName: {
          contains: query.courtName.trim(),
          mode: 'insensitive',
        },
      });
    }

    if (query.search) {
      const term = query.search.trim();
      andConditions.push({
        OR: [
          { caseNumber: { contains: term, mode: 'insensitive' } },
          { title: { contains: term, mode: 'insensitive' } },
          { courtName: { contains: term, mode: 'insensitive' } },
          { opposingParty: { contains: term, mode: 'insensitive' } },
          { opposingLawyer: { contains: term, mode: 'insensitive' } },
          { client: { firstName: { contains: term, mode: 'insensitive' } } },
          { client: { lastName: { contains: term, mode: 'insensitive' } } },
        ],
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  private async findCaseOrThrow(organizationId: string, caseId: string) {
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId },
      include: caseListInclude,
    });

    if (!caseRecord) {
      throw new NotFoundException('Case not found');
    }

    return caseRecord;
  }

  private assertCanEditCase(
    user: AuthenticatedUser,
    caseRecord: { assignedLawyerId: string | null },
  ): void {
    const isOwner = user.role === UserRole.ORG_ADMIN;
    const isAssignedLawyer = caseRecord.assignedLawyerId === user.id;

    if (!isOwner && !isAssignedLawyer) {
      throw new ForbiddenException(
        'Only the organization owner or assigned lawyer can modify this case',
      );
    }
  }

  private async validateClient(organizationId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, organizationId, isActive: true },
    });

    if (!client) {
      throw new BadRequestException('Client not found in your organization');
    }
  }

  private async validateLawyer(organizationId: string, lawyerId: string) {
    const lawyer = await this.prisma.user.findFirst({
      where: {
        id: lawyerId,
        organizationId,
        isActive: true,
        role: {
          in: [
            UserRole.ORG_ADMIN,
            UserRole.LAWYER,
            UserRole.SENIOR_LAWYER,
            UserRole.ASSOCIATE,
          ],
        },
      },
    });

    if (!lawyer) {
      throw new BadRequestException('Assigned lawyer not found in your organization');
    }
  }

  private async generateCaseNumber(organizationId: string): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `CASE-${year}-`;

    const latest = await this.prisma.case.findFirst({
      where: {
        organizationId,
        caseNumber: { startsWith: prefix },
      },
      orderBy: { caseNumber: 'desc' },
      select: { caseNumber: true },
    });

    let next = 1;
    if (latest) {
      const match = latest.caseNumber.match(/-(\d+)$/);
      if (match) {
        next = parseInt(match[1], 10) + 1;
      }
    }

    return `${prefix}${String(next).padStart(3, '0')}`;
  }

  private async ensureUniqueCaseNumber(
    organizationId: string,
    caseNumber: string,
    excludeCaseId?: string,
  ) {
    const existing = await this.prisma.case.findFirst({
      where: {
        organizationId,
        caseNumber: caseNumber.trim(),
        ...(excludeCaseId && { id: { not: excludeCaseId } }),
      },
    });

    if (existing) {
      throw new ConflictException('A case with this case number already exists');
    }
  }

  private buildPaymentsSummary(
    aggregates: Array<{
      status: PaymentStatus;
      _sum: { amount: Prisma.Decimal | null };
      _count: { id: number };
    }>,
  ) {
    let total = 0;
    let paid = 0;
    let pending = 0;
    let count = 0;

    for (const row of aggregates) {
      const amount = decimalToNumber(row._sum.amount ?? 0);
      count += row._count.id;
      total += amount;

      if (row.status === PaymentStatus.PAID) {
        paid += amount;
      } else if (
        row.status === PaymentStatus.PENDING ||
        row.status === PaymentStatus.OVERDUE ||
        row.status === PaymentStatus.PARTIAL
      ) {
        pending += amount;
      }
    }

    return { total, paid, pending, count };
  }
}
