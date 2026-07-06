import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { OrganizationStatus, UserRole } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { comparePassword, hashPassword } from '../../common/utils/password.util';
import { PermissionsService } from '../../common/permissions';
import { LoginDto, RegisterDto } from './dto';
import {
  AuthResponse,
  ProfileResponse,
  slugify,
  splitAdminName,
  toSafeOrganization,
  toSafeUser,
} from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await hashPassword(dto.password);
    const { firstName, lastName } = splitAdminName(dto.adminName);
    const slug = await this.generateUniqueSlug(dto.organizationName);

    const result = await this.prisma.$transaction(async (tx) => {
      const organization = await tx.organization.create({
        data: {
          name: dto.organizationName.trim(),
          slug,
          status: OrganizationStatus.TRIAL,
        },
      });

      const user = await tx.user.create({
        data: {
          organizationId: organization.id,
          email: dto.email.toLowerCase(),
          passwordHash,
          firstName,
          lastName,
          phone: dto.phone?.trim(),
          role: UserRole.ORG_ADMIN,
          isActive: true,
        },
      });

      return { user, organization };
    });

    return this.buildAuthResponse(result.user, result.organization);
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email.toLowerCase(),
        isActive: true,
      },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (
      user.organization.status === OrganizationStatus.SUSPENDED ||
      user.organization.status === OrganizationStatus.INACTIVE
    ) {
      throw new UnauthorizedException('Organization is not active');
    }

    const isValid = await comparePassword(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.buildAuthResponse(updatedUser, user.organization);
  }

  async getProfile(userId: string): Promise<ProfileResponse> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, isActive: true },
      include: { organization: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      user: toSafeUser(user),
      organization: toSafeOrganization(user.organization),
      permissions: await this.permissionsService.getUserAccess(
        user.organizationId,
        user.role,
      ),
    };
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name) || 'organization';
    let slug = baseSlug;
    let counter = 1;

    while (await this.prisma.organization.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter += 1;
    }

    return slug;
  }

  private async buildAuthResponse(
    user: Parameters<typeof toSafeUser>[0],
    organization: Parameters<typeof toSafeOrganization>[0],
  ): Promise<AuthResponse> {
    const payload = {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: this.configService.getOrThrow<string>(
        'jwt.refreshTokenExpiresIn',
      ) as JwtSignOptions['expiresIn'],
    });

    const permissions = await this.permissionsService.getUserAccess(
      user.organizationId,
      user.role,
    );

    return {
      user: toSafeUser(user),
      organization: toSafeOrganization(organization),
      tokens: {
        accessToken,
        refreshToken,
      },
      permissions,
    };
  }
}
