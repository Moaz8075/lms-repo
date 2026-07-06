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
import {
  AttachCaseReferenceDto,
  CreateLegalNoteDto,
  ListLegalNotesQueryDto,
  UpdateLegalNoteDto,
} from './dto';
import { LegalNotesService } from './legal-notes.service';

@ApiTags('Legal Notes')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.LEGAL_RESEARCH)
@Controller('legal-notes')
export class LegalNotesController {
  constructor(private readonly legalNotesService: LegalNotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a legal note from highlighted text' })
  @ApiResponse({ status: 201, description: 'Legal note created successfully' })
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateLegalNoteDto,
  ) {
    return this.legalNotesService.create(user.organizationId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List legal notes with search and filters' })
  @ApiResponse({ status: 200, description: 'Legal notes retrieved successfully' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListLegalNotesQueryDto,
  ) {
    return this.legalNotesService.findAll(user.organizationId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a legal note by ID' })
  @ApiResponse({ status: 200, description: 'Legal note retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Legal note not found' })
  findOne(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.legalNotesService.findOne(user.organizationId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update title, personal note, or tags' })
  @ApiResponse({ status: 200, description: 'Legal note updated successfully' })
  @ApiResponse({ status: 404, description: 'Legal note not found' })
  update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
    @Body() dto: UpdateLegalNoteDto,
  ) {
    return this.legalNotesService.update(user.organizationId, user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete a legal note' })
  @ApiResponse({ status: 200, description: 'Legal note removed successfully' })
  @ApiResponse({ status: 404, description: 'Legal note not found' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.legalNotesService.remove(user.organizationId, user.id, id);
  }
}

@ApiTags('Case References')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.LEGAL_RESEARCH)
@Controller('cases/:caseId/references')
export class CaseReferencesController {
  constructor(private readonly legalNotesService: LegalNotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Attach a legal note to a case' })
  @ApiResponse({ status: 201, description: 'Reference attached successfully' })
  attach(
    @CurrentUser() user: AuthenticatedUser,
    @Param('caseId', ParseUuidPipe) caseId: string,
    @Body() dto: AttachCaseReferenceDto,
  ) {
    return this.legalNotesService.attachToCase(
      user.organizationId,
      user.id,
      caseId,
      dto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'List legal note references for a case' })
  @ApiResponse({ status: 200, description: 'References retrieved successfully' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Param('caseId', ParseUuidPipe) caseId: string,
  ) {
    return this.legalNotesService.listCaseReferences(user.organizationId, caseId);
  }

  @Delete(':referenceId')
  @ApiOperation({ summary: 'Remove a legal note reference from a case' })
  @ApiResponse({ status: 200, description: 'Reference removed successfully' })
  @ApiResponse({ status: 404, description: 'Reference not found' })
  detach(
    @CurrentUser() user: AuthenticatedUser,
    @Param('caseId', ParseUuidPipe) caseId: string,
    @Param('referenceId', ParseUuidPipe) referenceId: string,
  ) {
    return this.legalNotesService.detachFromCase(
      user.organizationId,
      user.id,
      caseId,
      referenceId,
    );
  }
}
