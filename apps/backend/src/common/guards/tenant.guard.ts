import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedUser } from '../interfaces';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user: AuthenticatedUser;
      headers: Record<string, string>;
      params: Record<string, string>;
    }>();

    const user = request.user;
    const headerOrgId = request.headers['x-organization-id'];
    const paramOrgId = request.params.organizationId;

    if (!user?.organizationId) {
      throw new ForbiddenException('Organization context is required');
    }

    if (headerOrgId && headerOrgId !== user.organizationId) {
      throw new ForbiddenException('Organization mismatch');
    }

    if (paramOrgId && paramOrgId !== user.organizationId) {
      throw new ForbiddenException('Organization mismatch');
    }

    return true;
  }
}
