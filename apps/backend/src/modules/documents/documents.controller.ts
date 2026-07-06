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
import { DocumentsService } from './documents.service';
import { ListDocumentsQueryDto, UploadDocumentDto } from './dto';

@ApiTags('Documents')
@ApiBearerAuth('access-token')
@PermissionResourceScope(PermissionResource.DOCUMENTS)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload a document to a case' })
  @ApiResponse({ status: 201, description: 'Document uploaded successfully' })
  upload(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UploadDocumentDto,
  ) {
    return this.documentsService.upload(user.organizationId, user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'List documents for a case' })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: ListDocumentsQueryDto,
  ) {
    return this.documentsService.findAll(user.organizationId, query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id', ParseUuidPipe) id: string,
  ) {
    return this.documentsService.remove(user.organizationId, user.id, id);
  }
}
