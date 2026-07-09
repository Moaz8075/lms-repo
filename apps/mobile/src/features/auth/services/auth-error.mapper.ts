import {
  AppError,
  NetworkError,
  TimeoutError,
  UnauthorizedError,
  UnknownError,
  ValidationError,
} from '@/lib/errors';

const GENERIC_MESSAGE = 'Something went wrong. Please try again.';

export function mapAuthError(error: unknown): string {
  if (error instanceof UnauthorizedError) {
    return 'Invalid email or password. Please try again.';
  }

  if (error instanceof NetworkError) {
    return 'Network unavailable. Check your connection and try again.';
  }

  if (error instanceof TimeoutError) {
    return 'The server is taking too long to respond. Please try again.';
  }

  if (error instanceof ValidationError) {
    if (error.details?.length) {
      return error.details[0];
    }
    return 'Please check the form and try again.';
  }

  if (error instanceof AppError) {
    if (error.statusCode === 409) {
      return 'An account with this email or organization slug already exists.';
    }

    if (error.statusCode && error.statusCode >= 500) {
      return 'Server unavailable. Please try again shortly.';
    }
  }

  if (error instanceof UnknownError) {
    return GENERIC_MESSAGE;
  }

  return GENERIC_MESSAGE;
}

export function mapForgotPasswordError(error: unknown): string {
  if (error instanceof NetworkError || error instanceof TimeoutError) {
    return mapAuthError(error);
  }

  // Avoid leaking whether an email exists in the system.
  return mapAuthError(error);
}
