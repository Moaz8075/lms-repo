import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { AuthenticatedUser } from '../interfaces';

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';
export const ORGANIZATION_ID_KEY = 'organizationId';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return request.user;
  },
);

export const OrganizationId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{
      user: AuthenticatedUser;
      headers: Record<string, string>;
    }>();

    return (
      request.user?.organizationId ??
      request.headers['x-organization-id'] ??
      ''
    );
  },
);
