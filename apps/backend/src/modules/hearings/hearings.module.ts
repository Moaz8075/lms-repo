import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ActivityLogsModule } from '../activity-logs/activity-logs.module';
import { HearingsController } from './hearings.controller';
import { HearingsService } from './hearings.service';

@Module({
  imports: [PrismaModule, ActivityLogsModule],
  controllers: [HearingsController],
  providers: [HearingsService],
  exports: [HearingsService],
})
export class HearingsModule {}
