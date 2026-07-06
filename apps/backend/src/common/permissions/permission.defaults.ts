import { UserRole } from '@prisma/client';
import {
  ManageableRole,
  OrganizationRolePermissions,
  PermissionResource,
  ResourceAccess,
  RolePermissionMap,
} from './permission.types';

function access(view: boolean, write: boolean): ResourceAccess {
  return { view, write: view && write };
}

function fullAccess(): ResourceAccess {
  return { view: true, write: true };
}

function viewOnly(): ResourceAccess {
  return { view: true, write: false };
}

function none(): ResourceAccess {
  return { view: false, write: false };
}

export const DEFAULT_ROLE_PERMISSIONS: Record<ManageableRole, RolePermissionMap> = {
  [UserRole.SENIOR_LAWYER]: {
    [PermissionResource.DASHBOARD]: fullAccess(),
    [PermissionResource.CLIENTS]: fullAccess(),
    [PermissionResource.CASES]: fullAccess(),
    [PermissionResource.DIARY]: fullAccess(),
    [PermissionResource.DOCUMENTS]: fullAccess(),
    [PermissionResource.PAYMENTS]: fullAccess(),
    [PermissionResource.EXPENSES]: fullAccess(),
    [PermissionResource.LEGAL_RESEARCH]: fullAccess(),
  },
  [UserRole.ASSOCIATE]: {
    [PermissionResource.DASHBOARD]: viewOnly(),
    [PermissionResource.CLIENTS]: fullAccess(),
    [PermissionResource.CASES]: fullAccess(),
    [PermissionResource.DIARY]: fullAccess(),
    [PermissionResource.DOCUMENTS]: fullAccess(),
    [PermissionResource.PAYMENTS]: viewOnly(),
    [PermissionResource.EXPENSES]: viewOnly(),
    [PermissionResource.LEGAL_RESEARCH]: fullAccess(),
  },
  [UserRole.CLERK]: {
    [PermissionResource.DASHBOARD]: viewOnly(),
    [PermissionResource.CLIENTS]: viewOnly(),
    [PermissionResource.CASES]: viewOnly(),
    [PermissionResource.DIARY]: fullAccess(),
    [PermissionResource.DOCUMENTS]: fullAccess(),
    [PermissionResource.PAYMENTS]: viewOnly(),
    [PermissionResource.EXPENSES]: viewOnly(),
    [PermissionResource.LEGAL_RESEARCH]: viewOnly(),
  },
  [UserRole.ACCOUNTANT]: {
    [PermissionResource.DASHBOARD]: viewOnly(),
    [PermissionResource.CLIENTS]: viewOnly(),
    [PermissionResource.CASES]: viewOnly(),
    [PermissionResource.DIARY]: viewOnly(),
    [PermissionResource.DOCUMENTS]: viewOnly(),
    [PermissionResource.PAYMENTS]: fullAccess(),
    [PermissionResource.EXPENSES]: fullAccess(),
    [PermissionResource.LEGAL_RESEARCH]: viewOnly(),
  },
};

export function buildAdminAccess(): RolePermissionMap {
  return {
    [PermissionResource.DASHBOARD]: fullAccess(),
    [PermissionResource.CLIENTS]: fullAccess(),
    [PermissionResource.CASES]: fullAccess(),
    [PermissionResource.DIARY]: fullAccess(),
    [PermissionResource.DOCUMENTS]: fullAccess(),
    [PermissionResource.PAYMENTS]: fullAccess(),
    [PermissionResource.EXPENSES]: fullAccess(),
    [PermissionResource.LEGAL_RESEARCH]: fullAccess(),
  };
}

export function buildNoAccess(): RolePermissionMap {
  return {
    [PermissionResource.DASHBOARD]: none(),
    [PermissionResource.CLIENTS]: none(),
    [PermissionResource.CASES]: none(),
    [PermissionResource.DIARY]: none(),
    [PermissionResource.DOCUMENTS]: none(),
    [PermissionResource.PAYMENTS]: none(),
    [PermissionResource.EXPENSES]: none(),
    [PermissionResource.LEGAL_RESEARCH]: none(),
  };
}

export function mergeRolePermissions(
  role: ManageableRole,
  stored?: Partial<RolePermissionMap>,
): RolePermissionMap {
  const defaults = DEFAULT_ROLE_PERMISSIONS[role];
  const merged = { ...defaults };

  if (!stored) return merged;

  for (const resource of Object.values(PermissionResource)) {
    const override = stored[resource];
    if (!override) continue;
    merged[resource] = {
      view: override.view ?? defaults[resource].view,
      write: override.write ?? defaults[resource].write,
    };
    if (!merged[resource].view) {
      merged[resource].write = false;
    }
  }

  return merged;
}

export function parseOrganizationRolePermissions(
  settings: unknown,
): OrganizationRolePermissions {
  if (!settings || typeof settings !== 'object') return {};
  const rolePermissions = (settings as Record<string, unknown>).rolePermissions;
  if (!rolePermissions || typeof rolePermissions !== 'object') return {};
  return rolePermissions as OrganizationRolePermissions;
}

export function buildPermissionsMatrix(
  stored: OrganizationRolePermissions,
): Record<ManageableRole, RolePermissionMap> {
  return {
    [UserRole.SENIOR_LAWYER]: mergeRolePermissions(
      UserRole.SENIOR_LAWYER,
      stored[UserRole.SENIOR_LAWYER],
    ),
    [UserRole.ASSOCIATE]: mergeRolePermissions(
      UserRole.ASSOCIATE,
      stored[UserRole.ASSOCIATE],
    ),
    [UserRole.CLERK]: mergeRolePermissions(UserRole.CLERK, stored[UserRole.CLERK]),
    [UserRole.ACCOUNTANT]: mergeRolePermissions(
      UserRole.ACCOUNTANT,
      stored[UserRole.ACCOUNTANT],
    ),
  };
}
