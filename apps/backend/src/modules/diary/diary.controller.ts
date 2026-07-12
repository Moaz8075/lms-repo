import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser, PermissionResourceScope } from '../../common/decorators';
import { PermissionResource } from '../../common/permissions';
import { AuthenticatedUser } from '../../common/interfaces';
import { ParseUuidPipe } from '../../common/pipes';
import { DiaryService } from './diary.service';
import {
  DiaryCalendarQueryDto,
  DiaryQueryDto,
  UpcomingDiaryQueryDto,
} from './dto';

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

  @Get('calendar')
  @ApiOperation({ summary: 'Month calendar summary for diary dots' })
  @ApiResponse({ status: 200, description: 'Calendar summary retrieved successfully' })
  getCalendar(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: DiaryCalendarQueryDto,
  ) {
    return this.diaryService.getCalendar(user.organizationId, query);
  }

  @Get('entries/:hearingId')
  @ApiOperation({ summary: 'Diary entry detail for a hearing' })
  @ApiResponse({ status: 200, description: 'Diary entry retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Diary entry not found' })
  getEntry(
    @CurrentUser() user: AuthenticatedUser,
    @Param('hearingId', ParseUuidPipe) hearingId: string,
  ) {
    return this.diaryService.getEntryDetail(user.organizationId, hearingId);
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
