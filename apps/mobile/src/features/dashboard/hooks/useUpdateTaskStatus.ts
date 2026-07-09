import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tasksApi } from '@/api/tasks.api';
import { dashboardKeys } from '@/features/dashboard/constants';
import type { TaskStatus } from '@/types/dashboard';

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) =>
      tasksApi.updateStatus(taskId, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
    },
  });
}
