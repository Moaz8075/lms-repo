import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSION_ACTION_KEY,
  PERMISSION_RESOURCE_KEY,
  SKIP_PERMISSION_KEY,
} from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators';
import { AuthenticatedUser } from '../interfaces';
import {
  PermissionAction,
  PermissionResource,
  PermissionsService,
} from '../permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const skipPermission = this.reflector.getAllAndOverride<boolean>(
      SKIP_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skipPermission) return true;

    const resource = this.reflector.getAllAndOverride<PermissionResource>(
      PERMISSION_RESOURCE_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!resource) return true;

    const request = context.switchToHttp().getRequest<{
      user: AuthenticatedUser;
      method: string;
    }>();

    const user = request.user;
    if (!user) {
      throw new ForbiddenException('Authentication required');
    }

    if (this.permissionsService.isAdmin(user.role)) {
      return true;
    }

    const explicitAction = this.reflector.getAllAndOverride<PermissionAction>(
      PERMISSION_ACTION_KEY,
      [context.getHandler(), context.getClass()],
    );

    const action =
      explicitAction ??
      (['GET', 'HEAD'].includes(request.method)
        ? PermissionAction.VIEW
        : PermissionAction.WRITE);

    const { access } = await this.permissionsService.getUserAccess(
      user.organizationId,
      user.role,
    );

    if (!this.permissionsService.hasAccess(access, resource, action)) {
      throw new ForbiddenException('Insufficient permissions for this action');
    }

    return true;
  }
}
