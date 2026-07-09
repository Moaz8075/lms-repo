import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateTaskStatusDto } from './dto';
import { TaskResponse, toTaskResponse } from './tasks.types';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async updateStatus(
    organizationId: string,
    taskId: string,
    dto: UpdateTaskStatusDto,
  ): Promise<TaskResponse> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, organizationId },
      include: { case: true },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    const updated = await this.prisma.task.update({
      where: { id: taskId },
      data: { status: dto.status as TaskStatus },
      include: { case: true },
    });

    return toTaskResponse(updated);
  }
}
