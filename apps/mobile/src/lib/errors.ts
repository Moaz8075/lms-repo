export type AppErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED_ERROR'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly statusCode?: number;
  readonly details?: string[];

  constructor(
    message: string,
    code: AppErrorCode,
    options?: { statusCode?: number; details?: string[]; cause?: unknown },
  ) {
    super(message, { cause: options?.cause });
    this.name = 'AppError';
    this.code = code;
    this.statusCode = options?.statusCode;
    this.details = options?.details;
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Unable to connect. Check your internet connection.') {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends AppError {
  constructor(message = 'Request timed out. Please try again.') {
    super(message, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: string[]) {
    super(message, 'VALIDATION_ERROR', { statusCode: 400, details });
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Your session has expired. Please sign in again.') {
    super(message, 'UNAUTHORIZED_ERROR', { statusCode: 401 });
    this.name = 'UnauthorizedError';
  }
}

export class UnknownError extends AppError {
  constructor(message = 'Something went wrong. Please try again.') {
    super(message, 'UNKNOWN_ERROR');
    this.name = 'UnknownError';
  }
}
