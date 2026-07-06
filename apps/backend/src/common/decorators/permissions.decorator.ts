import { SetMetadata } from '@nestjs/common';
import { PermissionAction, PermissionResource } from '../permissions';

export const PERMISSION_RESOURCE_KEY = 'permissionResource';
export const PERMISSION_ACTION_KEY = 'permissionAction';
export const SKIP_PERMISSION_KEY = 'skipPermission';

export const PermissionResourceScope = (resource: PermissionResource) =>
  SetMetadata(PERMISSION_RESOURCE_KEY, resource);

export const PermissionActionScope = (action: PermissionAction) =>
  SetMetadata(PERMISSION_ACTION_KEY, action);

export const SkipPermission = () => SetMetadata(SKIP_PERMISSION_KEY, true);
