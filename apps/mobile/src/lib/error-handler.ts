import axios, { isAxiosError } from 'axios';

import {
  AppError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  UnknownError,
  ValidationError,
} from '@/lib/errors';
import type { ApiErrorResponse } from '@/types';

export function parseApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (isAxiosError<ApiErrorResponse>(error)) {
    if (error.code === 'ECONNABORTED') {
      return new TimeoutError();
    }

    if (!error.response) {
      return new NetworkError();
    }

    const { status, data } = error.response;
    const message = data?.message ?? error.message;

    if (status === 401) {
      return new UnauthorizedError(message);
    }

    if (status === 400 || status === 422) {
      return new ValidationError(message, data?.errors);
    }

    return new UnknownError(message);
  }

  if (error instanceof Error) {
    return new UnknownError(error.message);
  }

  return new UnknownError();
}

export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}

export { axios, isAxiosError };
