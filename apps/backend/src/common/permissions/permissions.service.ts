import { Injectable } from '@nestjs/common';
import { UserRole, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  buildAdminAccess,
  buildNoAccess,
  buildPermissionsMatrix,
  mergeRolePermissions,
  parseOrganizationRolePermissions,
} from './permission.defaults';
import {
  ManageableRole,
  MANAGEABLE_ROLES,
  OrganizationRolePermissions,
  PERMISSION_RESOURCES,
  PermissionAction,
  PermissionResource,
  RolePermissionMap,
  RolePermissionsMatrixResponse,
  UserAccessResponse,
} from './permission.types';

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  isAdmin(role: string): boolean {
    return role === UserRole.ORG_ADMIN || role === UserRole.SUPER_ADMIN;
  }

  async getUserAccess(
    organizationId: string,
    role: string,
  ): Promise<UserAccessResponse> {
    if (this.isAdmin(role)) {
      return { isAdmin: true, access: buildAdminAccess() };
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { settings: true },
    });

    const stored = parseOrganizationRolePermissions(organization?.settings);
    const manageableRole = role as ManageableRole;

    if (!MANAGEABLE_ROLES.includes(manageableRole)) {
      return { isAdmin: false, access: buildNoAccess() };
    }

    return {
      isAdmin: false,
      access: mergeRolePermissions(manageableRole, stored[manageableRole]),
    };
  }

  async getPermissionsMatrix(
    organizationId: string,
  ): Promise<RolePermissionsMatrixResponse> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { settings: true },
    });

    const stored = parseOrganizationRolePermissions(organization?.settings);

    return {
      roles: [...MANAGEABLE_ROLES],
      resources: [...PERMISSION_RESOURCES],
      permissions: buildPermissionsMatrix(stored),
    };
  }

  async updatePermissionsMatrix(
    organizationId: string,
    permissions: Record<ManageableRole, RolePermissionMap>,
  ): Promise<RolePermissionsMatrixResponse> {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
    });

    if (!organization) {
      throw new Error('Organization not found');
    }

    const currentSettings =
      organization.settings && typeof organization.settings === 'object'
        ? (organization.settings as Record<string, unknown>)
        : {};

    const sanitized: OrganizationRolePermissions = {};

    for (const role of MANAGEABLE_ROLES) {
      const roleMap = permissions[role];
      if (!roleMap) continue;

      sanitized[role] = {};
      for (const resource of PERMISSION_RESOURCES) {
        const entry = roleMap[resource];
        if (!entry) continue;
        sanitized[role]![resource] = {
          view: !!entry.view,
          write: !!entry.view && !!entry.write,
        };
      }
    }

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        settings: {
          ...currentSettings,
          rolePermissions: sanitized,
        } as unknown as Prisma.InputJsonValue,
      },
    });

    return this.getPermissionsMatrix(organizationId);
  }

  hasAccess(
    access: RolePermissionMap,
    resource: PermissionResource,
    action: PermissionAction,
  ): boolean {
    const entry = access[resource];
    if (!entry) return false;
    if (action === PermissionAction.VIEW) return entry.view;
    return entry.view && entry.write;
  }
}
