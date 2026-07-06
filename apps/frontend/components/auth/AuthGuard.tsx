'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuthStore } from '@/store/auth.store';
import { ROUTES } from '@/utils/constants';
import { useAuthHydrated } from '@/hooks/useAuthHydrated';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const authHydrated = useAuthHydrated();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);

  useEffect(() => {
    if (authHydrated && !isAuthenticated && !accessToken) {
      router.replace(ROUTES.login);
    }
  }, [authHydrated, isAuthenticated, accessToken, router]);

  if (!authHydrated) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated && !accessToken) {
    return null;
  }

  return <>{children}</>;
}
