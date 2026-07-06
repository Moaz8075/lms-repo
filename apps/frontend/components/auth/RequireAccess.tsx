'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { EmptyState } from '@/components/ui/EmptyState';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';
import type { PermissionResource } from '@/types/permissions';
import { ROUTES } from '@/utils/constants';

interface RequireAccessProps {
  resource: PermissionResource;
  children: React.ReactNode;
  requireWrite?: boolean;
}

export function RequireAccess({ resource, children, requireWrite = false }: RequireAccessProps) {
  const router = useRouter();
  const { canView, canWrite, isAdmin, permissions, user } = usePermissions();
  const allowed = requireWrite ? canWrite(resource) : canView(resource);

  useEffect(() => {
    if (permissions && !allowed && !isAdmin) {
      router.replace(ROUTES.dashboard);
    }
  }, [allowed, isAdmin, permissions, router]);

  if (!user) return null;

  if (!allowed && !isAdmin) {
    return (
      <EmptyState
        title="Access denied"
        message="You do not have permission to view this section."
        color="indigo"
      />
    );
  }

  return <>{children}</>;
}

interface AdminOnlyProps {
  children: React.ReactNode;
}

export function AdminOnly({ children }: AdminOnlyProps) {
  const router = useRouter();
  const authHydrated = useAuthHydrated();
  const { isAdmin, user } = usePermissions();

  useEffect(() => {
    if (authHydrated && user && !isAdmin) {
      router.replace(ROUTES.dashboard);
    }
  }, [authHydrated, isAdmin, user, router]);

  if (!authHydrated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) return null;

  return <>{children}</>;
}
