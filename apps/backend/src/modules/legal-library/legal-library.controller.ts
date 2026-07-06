import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { CreateLibraryItemDto, ListLibraryItemsQueryDto } from './dto';
import { LegalLibraryService } from './legal-library.service';

@ApiTags('Legal Library')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.LEGAL_RESEARCH)
@Controller('legal-library')
export class LegalLibraryController {
  constructor(private readonly legalLibraryService: LegalLibraryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a reference document to the legal library' })
  @ApiResponse({ status: 201, description: 'Library item created successfully' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateLibraryItemDto,
  ) {
    return this.legalLibraryService.create(user.organizationId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List legal library items (org + system documents)' })
  @ApiResponse({ status: 200, description: 'Library items retrieved successfully' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListLibraryItemsQueryDto,
  ) {
    return this.legalLibraryService.findAll(user.organizationId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a legal library item by ID' })
  @ApiResponse({ status: 200, description: 'Library item retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Library item not found' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.legalLibraryService.findOne(user.organizationId, id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete an organization library item' })
  @ApiResponse({ status: 200, description: 'Library item removed successfully' })
  @ApiResponse({ status: 404, description: 'Library item not found' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.legalLibraryService.remove(user.organizationId, user.id, id);
  }
}
