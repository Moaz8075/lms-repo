'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';
import { organizationService } from '@/services/organization.service';
import {
  isOrgAdmin,
  needsPermissionsRefresh,
  resolveUserAccess,
} from '@/utils/permissions';

export function PermissionsHydrator() {
  const permissions = useAuthStore((s) => s.permissions);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setPermissions = useAuthStore((s) => s.setPermissions);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    if (permissions && !needsPermissionsRefresh(permissions)) return;

    const fallback = resolveUserAccess(user.role, null);
    if (fallback && isOrgAdmin(user.role)) {
      setPermissions(fallback);
      return;
    }

    organizationService
      .getMyAccess()
      .then(setPermissions)
      .catch(() =>
        authService
          .me()
          .then((profile) => setPermissions(profile.permissions))
          .catch(() => {
            if (fallback) setPermissions(fallback);
          }),
      );
  }, [isAuthenticated, permissions, setPermissions, user]);

  return null;
}
