import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import {
  CaseReferencesController,
  LegalNotesController,
} from './legal-notes.controller';
import { LegalNotesService } from './legal-notes.service';

@Module({
  imports: [PrismaModule, ActivityLogsModule],
  controllers: [LegalNotesController, CaseReferencesController],
  providers: [LegalNotesService],
  exports: [LegalNotesService],
})
export class LegalNotesModule {}
