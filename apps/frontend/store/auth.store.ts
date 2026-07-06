'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Organization, User } from '@/types';
import type { UserAccess } from '@/types/permissions';
import {
  AUTH_COOKIE_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
} from '@/utils/constants';
import { resolveUserAccess } from '@/utils/permissions';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  permissions: UserAccess | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: {
    user: User;
    organization: Organization;
    permissions?: UserAccess | null;
    accessToken: string;
    refreshToken: string;
  }) => void;
  setPermissions: (permissions: UserAccess) => void;
  clearAuth: () => void;
}

function setAuthCookie(token: string): void {
  document.cookie = `${AUTH_COOKIE_KEY}=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

function clearAuthCookie(): void {
  document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      organization: null,
      permissions: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ user, organization, permissions, accessToken, refreshToken }) => {
        const resolved =
          resolveUserAccess(user.role, permissions) ??
          permissions ??
          null;
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
          localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
          setAuthCookie(accessToken);
        }
        set({
          user,
          organization,
          permissions: resolved,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      setPermissions: (permissions) => set({ permissions }),

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
          clearAuthCookie();
        }
        set({
          user: null,
          organization: null,
          permissions: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'legalease-auth',
      partialize: (state) => ({
        user: state.user,
        organization: state.organization,
        permissions: state.permissions,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state?.user) return;
        const resolved = resolveUserAccess(state.user.role, state.permissions);
        if (resolved && resolved !== state.permissions) {
          state.permissions = resolved;
        }
      },
    },
  ),
);
