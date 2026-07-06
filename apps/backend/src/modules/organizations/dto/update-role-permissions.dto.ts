import { ApiProperty } from '@nestjs/swagger';
import { IsObject } from 'class-validator';
import { ManageableRole, RolePermissionMap } from '../../../common/permissions';

export class UpdateRolePermissionsDto {
  @ApiProperty({
    description: 'Role permissions matrix keyed by role',
  })
  @IsObject()
  permissions!: Record<ManageableRole, RolePermissionMap>;
}
