import { Task, Case } from '@prisma/client';

export interface TaskResponse {
  id: string;
  title: string;
  caseId: string | null;
  caseTitle: string | null;
  status: string;
  time: string | null;
  date: string;
}

type TaskWithCase = Task & { case: Case | null };

export function toTaskResponse(task: TaskWithCase): TaskResponse {
  return {
    id: task.id,
    title: task.title,
    caseId: task.caseId,
    caseTitle: task.case?.title ?? null,
    status: task.status,
    time: task.time,
    date: task.date.toISOString().slice(0, 10),
  };
}
