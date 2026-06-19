import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { AUTH_TOKEN_KEY, ROUTES } from '@/utils/constants';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    useAuthStore.getState().accessToken ??
    (typeof window !== 'undefined' ? localStorage.getItem(AUTH_TOKEN_KEY) : null);

  const organizationId = useAuthStore.getState().organization?.id;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (organizationId) {
    config.headers['x-organization-id'] = organizationId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      useAuthStore.getState().clearAuth();
      const isAuthPage =
        window.location.pathname.startsWith(ROUTES.login) ||
        window.location.pathname.startsWith(ROUTES.register);

      if (!isAuthPage) {
        window.location.href = ROUTES.login;
      }
    }

    return Promise.reject(error);
  },
);

export { api };

export async function unwrap<T>(promise: Promise<{ data: ApiSuccessResponse<T> }>): Promise<T> {
  const { data } = await promise;
  return data.data;
}
