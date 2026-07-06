import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { LegalLibraryController } from './legal-library.controller';
import { LegalLibraryService } from './legal-library.service';

@Module({
  imports: [PrismaModule, ActivityLogsModule],
  controllers: [LegalLibraryController],
  providers: [LegalLibraryService],
  exports: [LegalLibraryService],
})
export class LegalLibraryModule {}
