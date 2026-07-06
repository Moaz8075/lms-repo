import { Body, Controller, Get, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CurrentUser,
  PermissionActionScope,
  PermissionResourceScope,
  Roles,
  SkipPermission,
} from '../../common/decorators';
import { UserRole } from '../../common/enums';
import { PermissionAction, PermissionResource } from '../../common/permissions';
import { AuthenticatedUser } from '../../common/interfaces';
import { UpdateOrganizationDto, UpdateRolePermissionsDto } from './dto';
import { OrganizationsService } from './organizations.service';

@ApiTags('Organizations')
@ApiBearerAuth('access-token')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Get('me')
  @SkipPermission()
  @ApiOperation({ summary: 'Get current user organization' })
  @ApiResponse({ status: 200, description: 'Organization retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  getCurrentOrganization(@CurrentUser() user: AuthenticatedUser) {
    return this.organizationsService.getCurrentOrganization(user.organizationId);
  }

  @Patch('me')
  @Roles(UserRole.ORG_ADMIN)
  @SkipPermission()
  @ApiOperation({ summary: 'Update current organization (owner only)' })
  @ApiResponse({ status: 200, description: 'Organization updated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  updateCurrentOrganization(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateOrganizationDto,
  ) {
    return this.organizationsService.updateCurrentOrganization(
      user.organizationId,
      dto,
    );
  }

  @Get('stats')
  @PermissionResourceScope(PermissionResource.DASHBOARD)
  @PermissionActionScope(PermissionAction.VIEW)
  @ApiOperation({ summary: 'Get organization statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  getOrganizationStats(@CurrentUser() user: AuthenticatedUser) {
    return this.organizationsService.getOrganizationStats(user.organizationId);
  }

  @Get('me/access')
  @SkipPermission()
  @ApiOperation({ summary: 'Get current user access permissions' })
  getMyAccess(@CurrentUser() user: AuthenticatedUser) {
    return this.organizationsService.getUserAccess(
      user.organizationId,
      user.role,
    );
  }

  @Get('permissions')
  @Roles(UserRole.ORG_ADMIN)
  @SkipPermission()
  @ApiOperation({ summary: 'Get role permissions matrix (admin only)' })
  getPermissionsMatrix(@CurrentUser() user: AuthenticatedUser) {
    return this.organizationsService.getPermissionsMatrix(user.organizationId);
  }

  @Patch('permissions')
  @Roles(UserRole.ORG_ADMIN)
  @SkipPermission()
  @ApiOperation({ summary: 'Update role permissions matrix (admin only)' })
  updatePermissionsMatrix(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateRolePermissionsDto,
  ) {
    return this.organizationsService.updatePermissionsMatrix(
      user.organizationId,
      dto.permissions,
    );
  }
}
