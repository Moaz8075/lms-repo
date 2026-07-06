import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { DOCUMENT_STORAGE } from './storage/document-storage.interface';
import { UrlDocumentStorageService } from './storage/url-document-storage.service';

@Module({
  imports: [PrismaModule, ActivityLogsModule],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    {
      provide: DOCUMENT_STORAGE,
      useClass: UrlDocumentStorageService,
    },
  ],
  exports: [DocumentsService, DOCUMENT_STORAGE],
})
export class DocumentsModule {}
