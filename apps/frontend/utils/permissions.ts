import {
  PERMISSION_RESOURCES,
  PermissionResource,
  type ResourceAccess,
  type UserAccess,
} from '@/types/permissions';
import { UserRole } from '@/types';

export function isOrgAdmin(role?: string): boolean {
  return role === UserRole.ORG_ADMIN || role === UserRole.SUPER_ADMIN;
}

export function buildAdminAccess(): UserAccess {
  const access = {} as UserAccess['access'];
  for (const resource of PERMISSION_RESOURCES) {
    access[resource] = { view: true, write: true };
  }
  return { isAdmin: true, access };
}

const NO_ACCESS: ResourceAccess = { view: false, write: false };

function isAccessMapComplete(
  access: Partial<Record<PermissionResource, ResourceAccess>>,
): boolean {
  return PERMISSION_RESOURCES.every((resource) => access[resource] != null);
}

/** Fills missing resources (e.g. after new modules ship) so UI never reads undefined. */
export function completeAccessMap(
  access: Partial<Record<PermissionResource, ResourceAccess>>,
): UserAccess['access'] {
  const complete = {} as UserAccess['access'];
  for (const resource of PERMISSION_RESOURCES) {
    complete[resource] = access[resource] ?? NO_ACCESS;
  }
  return complete;
}

/** Ensures admins always have full access even when the API omits permissions (stale session / old backend). */
export function resolveUserAccess(
  role: string | undefined,
  permissions: UserAccess | null | undefined,
): UserAccess | null {
  if (permissions) {
    if (permissions.isAdmin) return permissions;
    return {
      ...permissions,
      access: completeAccessMap(permissions.access),
    };
  }
  if (isOrgAdmin(role)) return buildAdminAccess();
  return null;
}

export function needsPermissionsRefresh(permissions: UserAccess | null | undefined): boolean {
  if (!permissions || permissions.isAdmin) return false;
  return !isAccessMapComplete(permissions.access);
}

export function canView(
  access: UserAccess | null,
  resource: PermissionResource,
  role?: string,
): boolean {
  const resolved = resolveUserAccess(role, access);
  if (!resolved) return false;
  if (resolved.isAdmin) return true;
  return !!resolved.access[resource]?.view;
}

export function canWrite(
  access: UserAccess | null,
  resource: PermissionResource,
  role?: string,
): boolean {
  const resolved = resolveUserAccess(role, access);
  if (!resolved) return false;
  if (resolved.isAdmin) return true;
  const entry = resolved.access[resource];
  return !!entry?.view && !!entry?.write;
}

export function toggleWrite(entry: ResourceAccess, write: boolean): ResourceAccess {
  return { view: write ? true : entry.view, write: entry.view && write };
}

export function toggleView(entry: ResourceAccess, view: boolean): ResourceAccess {
  return { view, write: view ? entry.write : false };
}
