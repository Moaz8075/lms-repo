import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { API_ROLE_TO_DB, ApiUserRole } from '../../common/enums';
import { PaginatedResult } from '../../common/interfaces';
import { PaginationQueryDto } from '../../common/dto';
import { hashPassword } from '../../common/utils/password.util';
import { PrismaService } from '../../prisma/prisma.service';
import { splitAdminName } from '../auth/auth.types';
import { CreateUserDto, UpdateUserDto } from './dto';
import { toUserResponse, UserResponse } from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    organizationId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResult<UserResponse>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = { organizationId };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map(toUserResponse),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  async create(
    organizationId: string,
    dto: CreateUserDto,
  ): Promise<UserResponse> {
    const email = dto.email.toLowerCase();
    const dbRole = API_ROLE_TO_DB[dto.role];

    if (dto.role === ApiUserRole.OWNER) {
      throw new BadRequestException(
        'Cannot create additional owner accounts via this endpoint',
      );
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    const { firstName, lastName } = splitAdminName(dto.name);
    const passwordHash = await hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        organizationId,
        email,
        passwordHash,
        firstName,
        lastName,
        phone: dto.phone?.trim(),
        role: dbRole,
        isActive: true,
      },
    });

    return toUserResponse(user);
  }

  async updateRole(
    organizationId: string,
    actorId: string,
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserResponse> {
    if (actorId === userId) {
      throw new BadRequestException('You cannot change your own role');
    }

    const user = await this.findUserInOrganizationOrThrow(organizationId, userId);
    const dbRole = API_ROLE_TO_DB[dto.role];

    if (user.role === UserRole.ORG_ADMIN && dbRole !== UserRole.ORG_ADMIN) {
      await this.ensureOrganizationHasOwner(organizationId, userId);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: dbRole },
    });

    return toUserResponse(updated);
  }

  async deactivate(
    organizationId: string,
    actorId: string,
    userId: string,
  ): Promise<UserResponse> {
    if (actorId === userId) {
      throw new BadRequestException('You cannot deactivate your own account');
    }

    const user = await this.findUserInOrganizationOrThrow(organizationId, userId);

    if (!user.isActive) {
      throw new BadRequestException('User is already deactivated');
    }

    if (user.role === UserRole.ORG_ADMIN) {
      await this.ensureOrganizationHasOwner(organizationId, userId);
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { isActive: false },
    });

    return toUserResponse(updated);
  }

  private async findUserInOrganizationOrThrow(
    organizationId: string,
    userId: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, organizationId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async ensureOrganizationHasOwner(
    organizationId: string,
    excludeUserId: string,
  ): Promise<void> {
    const activeOwners = await this.prisma.user.count({
      where: {
        organizationId,
        role: UserRole.ORG_ADMIN,
        isActive: true,
        id: { not: excludeUserId },
      },
    });

    if (activeOwners === 0) {
      throw new ForbiddenException(
        'Organization must have at least one active owner',
      );
    }
  }
}
