import type { CaseListParams } from '@/types';

export const casesKeys = {
  all: ['cases'] as const,
  list: (params: CaseListParams) => ['cases', 'list', params] as const,
  detail: (id: string) => ['cases', 'detail', id] as const,
  hearings: (caseId: string) => ['cases', caseId, 'hearings'] as const,
  payments: (caseId: string) => ['cases', caseId, 'payments'] as const,
};

export const CASES_REFETCH_INTERVAL_MS = 30_000;
