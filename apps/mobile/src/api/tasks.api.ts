import { apiClient, unwrap } from '@/api/axios';
import type { TaskResponse, TaskStatus } from '@/types/dashboard';

export const tasksApi = {
  updateStatus: (taskId: string, status: TaskStatus) =>
    unwrap<TaskResponse>(apiClient.patch(`/tasks/${taskId}/status`, { status })),
};
