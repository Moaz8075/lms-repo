import {
  Body,
  Controller,
  Delete,
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
import { CasesService } from './cases.service';
import { CreateCaseDto, ListCasesQueryDto, UpdateCaseDto } from './dto';

@ApiTags('Cases')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.CASES)
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a case' })
  @ApiResponse({ status: 201, description: 'Case created successfully' })
  @ApiResponse({ status: 409, description: 'Case number already exists' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCaseDto,
  ) {
    return this.casesService.create(user.organizationId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List cases with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Cases retrieved successfully' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListCasesQueryDto,
  ) {
    return this.casesService.findAll(user.organizationId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case detail with summaries' })
  @ApiResponse({ status: 200, description: 'Case retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.casesService.findOne(user.organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a case (owner or assigned lawyer)' })
  @ApiResponse({ status: 200, description: 'Case updated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateCaseDto,
  ) {
    return this.casesService.update(user.organizationId, user, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a case' })
  @ApiResponse({ status: 200, description: 'Case deactivated successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.casesService.remove(user.organizationId, user, id);
  }
}
