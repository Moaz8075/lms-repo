import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, PermissionActionScope, PermissionResourceScope } from '../../common/decorators';
import { PermissionAction, PermissionResource } from '../../common/permissions';
import { AuthenticatedUser } from '../../common/interfaces';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.DASHBOARD)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @PermissionActionScope(PermissionAction.VIEW)
  @ApiOperation({ summary: 'Mobile dashboard aggregate — hearings, tasks, payments, cases' })
  @ApiResponse({ status: 200, description: 'Dashboard data retrieved successfully' })
  getDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getDashboard(user.organizationId);
  }
}
