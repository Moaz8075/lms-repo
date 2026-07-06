import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, PermissionResourceScope } from '../../common/decorators';
import { PermissionResource } from '../../common/permissions';
import { AuthenticatedUser } from '../../common/interfaces';
import { DiaryService } from './diary.service';
import { DiaryQueryDto, UpcomingDiaryQueryDto } from './dto';

@ApiTags('Diary')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.DIARY)
@Controller('diary')
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get('upcoming')
  @ApiOperation({ summary: 'Upcoming agenda grouped by date' })
  @ApiResponse({ status: 200, description: 'Upcoming agenda retrieved successfully' })
  getUpcoming(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: UpcomingDiaryQueryDto,
  ) {
    return this.diaryService.getUpcoming(user.organizationId, query);
  }

  @Get()
  @ApiOperation({ summary: 'Daily agenda — hearings and tasks for a date' })
  @ApiResponse({ status: 200, description: 'Daily agenda retrieved successfully' })
  getDaily(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: DiaryQueryDto,
  ) {
    return this.diaryService.getDaily(user.organizationId, query);
  }
}
