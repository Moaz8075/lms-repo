import { create } from 'zustand';

import { authApi } from '@/api/auth.api';
import { queryClient } from '@/lib/query-client';
import {
  clearAllTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '@/lib/secure-storage';
import { withTimeout } from '@/lib/with-timeout';
import type { LoginPayload, Organization, RegisterPayload, User } from '@/types';

const SESSION_RESTORE_TIMEOUT_MS = 10_000;

interface AuthState {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBootstrapped: boolean;

  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  clear: () => Promise<void>;
}

async function persistTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([saveAccessToken(accessToken), saveRefreshToken(refreshToken)]);
}

async function applyAuthSession(
  response: Awaited<ReturnType<typeof authApi.login>>,
): Promise<void> {
  await persistTokens(response.tokens.accessToken, response.tokens.refreshToken);

  useAuthStore.setState({
    user: response.user,
    organization: response.organization,
    accessToken: response.tokens.accessToken,
    refreshToken: response.tokens.refreshToken,
    isAuthenticated: true,
    isLoading: false,
    isBootstrapped: true,
  });
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  organization: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  isBootstrapped: false,

  login: async (payload) => {
    const response = await authApi.login(payload);
    await applyAuthSession(response);
  },

  register: async (payload) => {
    const response = await authApi.register(payload);
    await applyAuthSession(response);
  },

  logout: async () => {
    try {
      if (get().accessToken) {
        await authApi.logout();
      }
    } catch {
      // Always clear local session even if the API is unavailable.
    } finally {
      await get().clear();
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });

    try {
      await withTimeout(
        (async () => {
          const [accessToken, refreshToken] = await Promise.all([
            getAccessToken(),
            getRefreshToken(),
          ]);

          if (!accessToken || !refreshToken) {
            set({
              isLoading: false,
              isAuthenticated: false,
              isBootstrapped: true,
            });
            return;
          }

          set({ accessToken, refreshToken });

          const profile = await authApi.getProfile();

          set({
            user: profile.user,
            organization: profile.organization,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
            isBootstrapped: true,
          });
        })(),
        SESSION_RESTORE_TIMEOUT_MS,
        'Session restore timed out',
      );
    } catch {
      await get().clear();
      set({
        isLoading: false,
        isAuthenticated: false,
        isBootstrapped: true,
      });
    }
  },

  setUser: (user) => set({ user }),

  setTokens: async (accessToken, refreshToken) => {
    await persistTokens(accessToken, refreshToken);
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  clear: async () => {
    await clearAllTokens();
    queryClient.clear();

    set({
      user: null,
      organization: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isBootstrapped: true,
    });
  },
}));
