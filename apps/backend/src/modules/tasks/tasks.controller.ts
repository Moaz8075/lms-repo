import { Body, Controller, Param, Patch } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, PermissionActionScope, PermissionResourceScope } from '../../common/decorators';
import { PermissionAction, PermissionResource } from '../../common/permissions';
import { AuthenticatedUser } from '../../common/interfaces';
import { ParseUuidPipe } from '../../common/pipes';
import { UpdateTaskStatusDto } from './dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.DIARY)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Patch(':id/status')
  @PermissionActionScope(PermissionAction.WRITE)
  @ApiOperation({ summary: 'Update task status (e.g. mark complete)' })
  @ApiResponse({ status: 200, description: 'Task status updated successfully' })
  updateStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(user.organizationId, id, dto);
  }
}
