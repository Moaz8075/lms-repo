import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponse } from '../interfaces';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponse<T>> {
    return next.handle().pipe(
      map((data: T | ApiSuccessResponse<T>) => {
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
