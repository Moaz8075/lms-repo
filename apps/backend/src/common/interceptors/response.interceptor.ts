import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  StreamableFile,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from '../interfaces';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T> | T>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T> | T> {
    return next.handle().pipe(
      map((data: T | ApiSuccessResponse<T>) => {
        // Binary/file responses must not be wrapped in JSON envelopes
        if (data instanceof StreamableFile) {
          return data;
        }

        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          (data as ApiSuccessResponse<T>).success === true
        ) {
          return data as ApiSuccessResponse<T>;
        }

        return {
          success: true as const,
          message: 'Request successful',
          data: (data ?? {}) as T,
        };
      }),
    );
  }
}
