import { ActivityType, Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface LogActivityParams {
  organizationId: string;
  userId: string;
  activityType: ActivityType;
  entityType: string;
  entityId: string;
  description: string;
  metadata?: Prisma.InputJsonValue;
}

@Injectable()
export class ActivityLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: LogActivityParams): Promise<void> {
    await this.prisma.activityLog.create({
      data: {
        organizationId: params.organizationId,
        userId: params.userId,
        activityType: params.activityType,
        entityType: params.entityType,
        entityId: params.entityId,
        description: params.description,
        metadata: params.metadata ?? {},
      },
    });
  }
}
