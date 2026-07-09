import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { parseApiError } from '@/lib/error-handler';
import { UnauthorizedError } from '@/lib/errors';
import { getRefreshToken } from '@/lib/secure-storage';
import { useAuthStore } from '@/store/auth.store';
import type { ApiErrorResponse, ApiSuccessResponse } from '@/types';

const REQUEST_TIMEOUT_MS = 30_000;

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken =
    useAuthStore.getState().refreshToken ?? (await getRefreshToken());

  if (!refreshToken) {
    return null;
  }

  try {
    const { data } = await axios.post<ApiSuccessResponse<{ accessToken: string; refreshToken: string }>>(
      `${env.apiUrl}/auth/refresh`,
      { refreshToken },
      {
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    const tokens = data.data;
    await useAuthStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    return null;
  }
}

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken, organization } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (organization?.id) {
    config.headers['x-organization-id'] = organization.id;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && originalRequest && !originalRequest.headers['X-Retry-After-Refresh']) {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      if (newAccessToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers['X-Retry-After-Refresh'] = 'true';
        return apiClient(originalRequest);
      }

      useAuthStore.getState().clear();
    }

    return Promise.reject(parseApiError(error));
  },
);

export async function unwrap<T>(
  promise: Promise<{ data: ApiSuccessResponse<T> }>,
): Promise<T> {
  try {
    const { data } = await promise;
    return data.data;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw parseApiError(error);
  }
}

export { axios };
