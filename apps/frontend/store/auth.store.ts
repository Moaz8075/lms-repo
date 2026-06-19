'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Organization, User } from '@/types';
import {
  AUTH_COOKIE_KEY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
} from '@/utils/constants';

interface AuthState {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setAuth: (payload: {
    user: User;
    organization: Organization;
    accessToken: string;
    refreshToken: string;
  }) => void;
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
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: ({ user, organization, accessToken, refreshToken }) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
          localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, refreshToken);
          setAuthCookie(accessToken);
        }
        set({
          user,
          organization,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY);
          clearAuthCookie();
        }
        set({
          user: null,
          organization: null,
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
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
