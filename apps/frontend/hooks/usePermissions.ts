'use client';

import { useAuthStore } from '@/store/auth.store';
import type { PermissionResource } from '@/types/permissions';
import { canView, canWrite, isOrgAdmin, resolveUserAccess } from '@/utils/permissions';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);
  const admin = isOrgAdmin(user?.role);
  const resolved = resolveUserAccess(user?.role, permissions);

  return {
    user,
    permissions: resolved,
    isAdmin: admin,
    canView: (resource: PermissionResource) => canView(permissions, resource, user?.role),
    canWrite: (resource: PermissionResource) => canWrite(permissions, resource, user?.role),
  };
}
