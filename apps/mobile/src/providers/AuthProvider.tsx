import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { createContext, useContext } from 'react';
import * as SplashScreen from 'expo-splash-screen';

import { LoadingOverlay } from '@/components/layout';
import { useAuthStore } from '@/store/auth.store';
import type { Organization, User } from '@/types';

const BOOTSTRAP_FAILSAFE_MS = 12_000;

interface AuthContextValue {
  user: User | null;
  organization: Organization | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const user = useAuthStore((state) => state.user);
  const organization = useAuthStore((state) => state.organization);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const storeLogout = useAuthStore((state) => state.logout);
  const bootstrapStarted = useRef(false);

  useEffect(() => {
    if (bootstrapStarted.current) {
      return;
    }
    bootstrapStarted.current = true;
    void restoreSession();
  }, [restoreSession]);

  useEffect(() => {
    if (isBootstrapped) {
      void SplashScreen.hideAsync();
    }
  }, [isBootstrapped]);

  useEffect(() => {
    const failSafe = setTimeout(() => {
      const state = useAuthStore.getState();
      if (!state.isBootstrapped) {
        void state.clear();
      }
      void SplashScreen.hideAsync();
    }, BOOTSTRAP_FAILSAFE_MS);

    return () => clearTimeout(failSafe);
  }, []);

  const value = useMemo(
    () => ({
      user,
      organization,
      isAuthenticated,
      isLoading: isLoading || !isBootstrapped,
      logout: storeLogout,
    }),
    [user, organization, isAuthenticated, isLoading, isBootstrapped, storeLogout],
  );

  if (value.isLoading) {
    return <LoadingOverlay />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
