import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
import { CreateHearingDto, ListHearingsQueryDto, UpdateHearingDto } from './dto';
import { HearingsService } from './hearings.service';

@ApiTags('Hearings')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.DIARY)
@Controller('hearings')
export class HearingsController {
  constructor(private readonly hearingsService: HearingsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Schedule a hearing' })
  @ApiResponse({ status: 201, description: 'Hearing created successfully' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateHearingDto,
  ) {
    return this.hearingsService.create(user.organizationId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List hearings for a case' })
  @ApiResponse({ status: 200, description: 'Hearings retrieved successfully' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListHearingsQueryDto,
  ) {
    return this.hearingsService.findAll(user.organizationId, query);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a hearing' })
  @ApiResponse({ status: 200, description: 'Hearing updated successfully' })
  @ApiResponse({ status: 404, description: 'Hearing not found' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateHearingDto,
  ) {
    return this.hearingsService.update(user.organizationId, user.id, id, dto);
  }
}
