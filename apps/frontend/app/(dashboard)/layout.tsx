'use client';

import { AuthGuard } from '@/components/auth/AuthGuard';
import { PermissionsHydrator } from '@/components/auth/PermissionsHydrator';
import { AppLayout } from '@/components/layout/AppLayout';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PermissionsHydrator />
      <AppLayout>{children}</AppLayout>
    </AuthGuard>
  );
}
