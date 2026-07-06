import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PermissionsService } from '../../common/permissions';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateOrganizationDto } from './dto';
import {
  OrganizationResponse,
  OrganizationStatsResponse,
  toOrganizationResponse,
} from './organizations.types';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async getCurrentOrganization(
    organizationId: string,
  ): Promise<OrganizationResponse> {
    const organization = await this.findOrganizationOrThrow(organizationId);
    return toOrganizationResponse(organization);
  }

  async updateCurrentOrganization(
    organizationId: string,
    dto: UpdateOrganizationDto,
  ): Promise<OrganizationResponse> {
    await this.findOrganizationOrThrow(organizationId);

    const organization = await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...(dto.name !== undefined && { name: dto.name.trim() }),
        ...(dto.phone !== undefined && { phone: dto.phone.trim() || null }),
        ...(dto.address !== undefined && { address: dto.address.trim() || null }),
        ...(dto.logo !== undefined && { logo: dto.logo.trim() || null }),
      },
    });

    return toOrganizationResponse(organization);
  }

  async getOrganizationStats(
    organizationId: string,
  ): Promise<OrganizationStatsResponse> {
    await this.findOrganizationOrThrow(organizationId);

    const [totalUsers, totalClients, totalCases] = await Promise.all([
      this.prisma.user.count({ where: { organizationId } }),
      this.prisma.client.count({ where: { organizationId } }),
      this.prisma.case.count({ where: { organizationId } }),
    ]);

    return { totalUsers, totalClients, totalCases };
  }

  getPermissionsMatrix(organizationId: string) {
    return this.permissionsService.getPermissionsMatrix(organizationId);
  }

  updatePermissionsMatrix(
    organizationId: string,
    permissions: Parameters<
      PermissionsService['updatePermissionsMatrix']
    >[1],
  ) {
    return this.permissionsService.updatePermissionsMatrix(
      organizationId,
      permissions,
    );
  }

  getUserAccess(organizationId: string, role: string) {
    return this.permissionsService.getUserAccess(organizationId, role);
  }

  private async findOrganizationOrThrow(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }
}
