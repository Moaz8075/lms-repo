import { authApi } from '@/api/auth.api';
import { mapAuthError, mapForgotPasswordError } from '@/features/auth/services/auth-error.mapper';
import type { ForgotPasswordPayload } from '@/features/auth/types';
import type { LoginFormValues, RegisterFormValues } from '@/features/auth/validation';
import { NetworkError, TimeoutError } from '@/lib/errors';
import {
  getRememberEmail,
  removeRememberEmail,
  saveRememberEmail,
} from '@/lib/secure-storage';
import { useAuthStore } from '@/store/auth.store';
import type { LoginPayload, RegisterPayload } from '@/types';

function toLoginPayload(values: LoginFormValues): LoginPayload {
  return {
    email: values.email.trim().toLowerCase(),
    password: values.password,
  };
}

function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
  return {
    organizationName: values.organizationName.trim(),
    adminName: values.ownerName.trim(),
    email: values.email.trim().toLowerCase(),
    password: values.password,
    phone: values.phone?.trim() || undefined,
  };
}

export const authService = {
  getRememberedEmail: getRememberEmail,

  async login(values: LoginFormValues): Promise<void> {
    try {
      await useAuthStore.getState().login(toLoginPayload(values));

      if (values.rememberMe) {
        await saveRememberEmail(values.email.trim().toLowerCase());
      } else {
        await removeRememberEmail();
      }
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  },

  async register(values: RegisterFormValues): Promise<void> {
    try {
      await useAuthStore.getState().register(toRegisterPayload(values));
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  },

  async forgotPassword(payload: ForgotPasswordPayload): Promise<void> {
    try {
      await authApi.forgotPassword(payload);
    } catch (error) {
      if (error instanceof NetworkError || error instanceof TimeoutError) {
        throw new Error(mapForgotPasswordError(error));
      }
      // Do not reveal whether the email exists in the system.
    }
  },

  async logout(): Promise<void> {
    await useAuthStore.getState().logout();
  },

  async restoreSession(): Promise<void> {
    await useAuthStore.getState().restoreSession();
  },
};
