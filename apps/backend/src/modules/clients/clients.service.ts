import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginatedResult } from '../../common/interfaces';
import { PrismaService } from '../../prisma/prisma.service';
import { splitAdminName } from '../auth/auth.types';
import { CreateClientDto, ListClientsQueryDto, UpdateClientDto } from './dto';
import {
  ClientDetailResponse,
  ClientResponse,
  normalizeCnic,
  toClientCaseSummary,
  toClientResponse,
} from './clients.types';

const RECENT_CASES_LIMIT = 5;

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    organizationId: string,
    dto: CreateClientDto,
  ): Promise<ClientResponse> {
    const { firstName, lastName } = splitAdminName(dto.name);
    const cnic = normalizeCnic(dto.cnic);
    const phone = dto.phone.trim();

    await this.ensureUniqueClientFields(organizationId, { cnic, phone });

    const client = await this.prisma.client.create({
      data: {
        organizationId,
        firstName,
        lastName,
        fatherName: dto.fatherName?.trim() || null,
        cnic,
        phone,
        whatsapp: dto.whatsapp?.trim() || null,
        address: dto.address?.trim() || null,
        notes: dto.notes?.trim() || null,
        isActive: true,
      },
    });

    return toClientResponse(client);
  }

  async findAll(
    organizationId: string,
    query: ListClientsQueryDto,
  ): Promise<PaginatedResult<ClientResponse>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = this.buildListWhere(organizationId, query);

    const [clients, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      items: clients.map(toClientResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async findOne(
    organizationId: string,
    clientId: string,
  ): Promise<ClientDetailResponse> {
    const client = await this.findClientOrThrow(organizationId, clientId);

    const [totalCases, recentCases] = await Promise.all([
      this.prisma.case.count({
        where: { organizationId, clientId },
      }),
      this.prisma.case.findMany({
        where: { organizationId, clientId },
        orderBy: { createdAt: 'desc' },
        take: RECENT_CASES_LIMIT,
      }),
    ]);

    return {
      ...toClientResponse(client),
      totalCases,
      recentCases: recentCases.map(toClientCaseSummary),
    };
  }

  async update(
    organizationId: string,
    clientId: string,
    dto: UpdateClientDto,
  ): Promise<ClientResponse> {
    const client = await this.findClientOrThrow(organizationId, clientId);

    if (!client.isActive) {
      throw new BadRequestException('Cannot update a deactivated client');
    }

    const cnic =
      dto.cnic !== undefined ? normalizeCnic(dto.cnic) : undefined;
    const phone = dto.phone?.trim();

    await this.ensureUniqueClientFields(organizationId, {
      cnic,
      phone,
      excludeClientId: clientId,
    });

    const nameUpdate =
      dto.name !== undefined ? splitAdminName(dto.name) : undefined;

    const updated = await this.prisma.client.update({
      where: { id: clientId },
      data: {
        ...(nameUpdate && {
          firstName: nameUpdate.firstName,
          lastName: nameUpdate.lastName,
        }),
        ...(dto.fatherName !== undefined && {
          fatherName: dto.fatherName.trim() || null,
        }),
        ...(cnic !== undefined && { cnic }),
        ...(phone !== undefined && { phone }),
        ...(dto.whatsapp !== undefined && {
          whatsapp: dto.whatsapp.trim() || null,
        }),
        ...(dto.address !== undefined && {
          address: dto.address.trim() || null,
        }),
        ...(dto.notes !== undefined && {
          notes: dto.notes.trim() || null,
        }),
      },
    });

    return toClientResponse(updated);
  }

  async remove(
    organizationId: string,
    clientId: string,
  ): Promise<ClientResponse> {
    const client = await this.findClientOrThrow(organizationId, clientId);

    if (!client.isActive) {
      throw new BadRequestException('Client is already deactivated');
    }

    const updated = await this.prisma.client.update({
      where: { id: clientId },
      data: { isActive: false },
    });

    return toClientResponse(updated);
  }

  private buildListWhere(
    organizationId: string,
    query: ListClientsQueryDto,
  ): Prisma.ClientWhereInput {
    const where: Prisma.ClientWhereInput = {
      organizationId,
      isActive: true,
    };

    const andConditions: Prisma.ClientWhereInput[] = [];

    if (query.search) {
      const term = query.search.trim();
      andConditions.push({
        OR: [
          { firstName: { contains: term, mode: 'insensitive' } },
          { lastName: { contains: term, mode: 'insensitive' } },
          { fatherName: { contains: term, mode: 'insensitive' } },
        ],
      });
    }

    if (query.cnic) {
      const normalized = normalizeCnic(query.cnic.trim());
      andConditions.push({
        OR: [
          { cnic: { contains: query.cnic.trim(), mode: 'insensitive' } },
          ...(normalized ? [{ cnic: normalized }] : []),
        ],
      });
    }

    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    return where;
  }

  private async findClientOrThrow(organizationId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, organizationId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  private async ensureUniqueClientFields(
    organizationId: string,
    fields: {
      cnic?: string | null;
      phone?: string;
      excludeClientId?: string;
    },
  ): Promise<void> {
    const { cnic, phone, excludeClientId } = fields;

    if (cnic) {
      const existingByCnic = await this.prisma.client.findFirst({
        where: {
          organizationId,
          cnic,
          ...(excludeClientId && { id: { not: excludeClientId } }),
        },
      });

      if (existingByCnic) {
        throw new ConflictException('A client with this CNIC already exists');
      }
    }

    if (phone) {
      const existingByPhone = await this.prisma.client.findFirst({
        where: {
          organizationId,
          phone,
          ...(excludeClientId && { id: { not: excludeClientId } }),
        },
      });

      if (existingByPhone) {
        throw new ConflictException('A client with this phone number already exists');
      }
    }
  }
}
